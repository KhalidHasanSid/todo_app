import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Share from './Share';
import SharedNotes from './SharedNotes';
import NoteHistory from './ViewHistory';

export default function Note() {
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [newNote, setNewNote] = useState({ title: '', description: '' });
  const [shareNoteId, setShareNoteId] = useState(null);
  const [showSharedNotes, setShowSharedNotes] = useState(false);
  const [viewHistoryNoteId, setViewHistoryNoteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:6800/api/v1/todo/gettodo', {
        withCredentials: true,
      });
      setNotes(res.data.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim()) return;
    try {
      await axios.post('http://localhost:6800/api/v1/todo/newtodo', newNote, {
        withCredentials: true,
      });
      setNewNote({ title: '', description: '' });
      fetchNotes();
    } catch (err) {
      console.error('Failed to add note:', err.response?.data || err.message);
    }
  };

  const handleEdit = async (id) => {
    if (!editForm.title.trim()) return;
    try {
      await axios.patch(
        `http://localhost:6800/api/v1/todo/updatetodo/${id}`,
        {
          title: editForm.title,
          description: editForm.description,
        },
        { withCredentials: true }
      );
      setEditId(null);
      setEditForm({ title: '', description: '' });
      fetchNotes();
    } catch (err) {
      console.error('Failed to edit note:', err);
    }
  };

  const handleDone = async (id) => {
    try {
      await axios.patch(
        `http://localhost:6800/api/v1/todo/updatetodo/${id}`,
        { status: 'done' },
        { withCredentials: true }
      );
      fetchNotes();
    } catch (err) {
      console.error('Failed to mark note as done:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:6800/api/v1/todo/deletetodo/${id}`, {
        withCredentials: true,
      });
      fetchNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const handleRevert = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:6800/api/v1/revertHistory/revert/${id}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200 || res.status === 204) {
        fetchNotes();
      } else {
        console.warn('Unexpected response while reverting note');
      }
    } catch (err) {
      console.error('Failed to revert note:', err.response?.data?.message || err.message);
    }
  };

  const handleShare = (id) => {
    setShareNoteId(id);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        'http://localhost:6800/api/v1/user/logout',
        {},
        { withCredentials: true }
      );
      if (res.data.statusCode === 200) {
        localStorage.removeItem('uid');
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowSharedNotes(true)}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
          >
            Shared Notes
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Note */}
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

      {/* Notes */}
      <h2 className="text-xl font-bold mb-4">All Notes</h2>
      {notes.length === 0 ? (
        <p className="text-gray-500 text-center">No notes found.</p>
      ) : (
        notes.map((note) => (
          <div
            key={note._id}
            className="border p-4 mb-4 rounded bg-white shadow-sm"
          >
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
                <h3 className="text-lg font-semibold text-gray-800">
                  {note.title}
                </h3>
                <p className="text-gray-700">{note.description}</p>
                <p className="text-sm mt-1 text-gray-600">
                  Status: <strong>{note.status}</strong>
                </p>
                <div className="mt-3 space-x-2">
                  <button
                    onClick={() => handleDone(note._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => {
                      setEditId(note._id);
                      setEditForm({ title: note.title, description: note.description });
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleRevert(note._id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                  >
                    Revert
                  </button>
                  <button
                    onClick={() => setViewHistoryNoteId(note._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                  >
                    View History
                  </button>
                  <button
                    onClick={() => handleShare(note._id)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                  >
                    Share
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}

      {/* Modals */}
      {shareNoteId && <Share noteId={shareNoteId} onClose={() => setShareNoteId(null)} />}
      {showSharedNotes && <SharedNotes onClose={() => setShowSharedNotes(false)} />}
      {viewHistoryNoteId && (
        <NoteHistory
          noteId={viewHistoryNoteId}
          onClose={() => setViewHistoryNoteId(null)}
        />
      )}
    </div>
  );
}
