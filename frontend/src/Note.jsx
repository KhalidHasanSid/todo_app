import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Note() {
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [newNote, setNewNote] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:6800/api/v1/todo/gettodo', { withCredentials: true });
      setNotes(response.data.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddNote = async () => {
    try {
      await axios.post('http://localhost:6800/api/v1/todo/newtodo', newNote, {
        withCredentials: true,
      });
      setNewNote({ title: '', description: '' });
      fetchNotes();
      alert("Note added successfully");
    } catch (err) {
      alert("Failed to add note");
      console.error('Add note error:', err.response?.data || err.message);
    }
  };

  const handleDone = async (id) => {
    try {
      await axios.patch(`http://localhost:6800/api/v1/todo/updatetodo/${id}`, { status: 'done' }, { withCredentials: true });
      fetchNotes();
    } catch (error) {
      alert("Failed to mark as done");
      console.error('Error:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      await axios.patch(`http://localhost:6800/api/v1/todo/updatetodo/${id}`, {
        title: editForm.title,
        description: editForm.description,
      }, { withCredentials: true });
      setEditId(null);
      setEditForm({ title: '', description: '' });
      fetchNotes();
    } catch (error) {
      alert("Failed to edit note");
      console.error('Error editing note:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:6800/api/v1/todo/deletetodo/${id}`, { withCredentials: true });
      fetchNotes();
    } catch (error) {
      alert("Failed to delete note");
      console.error('Error deleting note:', error);
    }
  };

 const handleLogout = async () => {
  try {
    const res = await axios.post(
      "http://localhost:6800/api/v1/user/logout",
      {}, 
      {
        withCredentials: true 
      }
    );
    console.log(res);
    if(res.data.statusCode===200)
   localStorage.removeItem("uid");
    navigate("/login");
  } catch (err) {
    console.error("Logout error:", err.response?.data || err.message);
  }
};

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Logout button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* New Note */}
      <div className="mb-6 p-4 border rounded bg-gray-50 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Add New Note</h2>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={newNote.description}
          onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddNote}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <h2 className="text-xl font-bold mb-4">All Notes</h2>
      {notes.length === 0 ? (
        <p className="text-gray-500 text-center">No notes found.</p>
      ) : (
        notes.map((note) => (
          <div key={note._id} className="border p-4 mb-4 rounded bg-white shadow-sm">
            {editId === note._id ? (
              <>
                <input
                  className="border p-2 mb-2 block w-full"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Title"
                />
                <textarea
                  className="border p-2 mb-2 block w-full"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Description"
                />
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 mr-2 rounded"
                  onClick={() => handleEdit(note._id)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                <p className="text-gray-700">{note.description}</p>
                <p className="text-sm mt-1 text-gray-600">
                  Status: <strong>{note.status}</strong>
                </p>
                <div className="mt-3 space-x-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50"
                    onClick={() => handleDone(note._id)}
                    disabled={note.status === 'done'}
                  >
                    Done
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setEditId(note._id);
                      setEditForm({ title: note.title, description: note.description });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
