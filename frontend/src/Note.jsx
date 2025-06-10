import React,{useState,useEffect} from 'react'
import axios from 'axios'

export default function Note() {
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
   const [newNote, setNewNote] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchNotes();
  }, []);

   const handleAddNote = async () => {
    try {
      await axios.post('http://localhost:6800/api/v1/todo/newtodo', newNote, {
        withCredentials: true,
      });
      setNewNote({ title: '', description: '' });
      fetchNotes();
    } catch (err) {
      console.error('Add note error:', err.response?.data || err.message);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:6800/api/v1/todo/gettodo', { withCredentials: true });
      console.log(response.data.data) 
      setNotes(response.data.data); 
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleDone = async (id) => {
    try {
      await axios.patch(`http://localhost:6800/api/v1/todo/updatetodo/${id}`, { status: 'done' },{withCredentials:true});
      fetchNotes();
    } catch (error) {
      console.error('Error marking note as done:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      await axios.patch(`http://localhost:6800/api/v1/todo/updatetodo/${id}`, {
        title: editForm.title,
        description: editForm.description,
      },{withCredentials:true});
      setEditId(null);
      setEditForm({ title: '', description: '' });
      fetchNotes();
    } catch (error) {
      console.error('Error editing note:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Note</h2>
      <div className="mb-6 p-4 border rounded bg-gray-50">
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add (in progress)
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">All Notes</h2>
      {notes.map((note) => (
        <div key={note._id} className="border p-4 mb-3 rounded bg-white shadow">
          {editId === note._id ? (
            <>
              <input
                className="border p-1 mb-2 block w-full"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Title"
              />
              <textarea
                className="border p-1 mb-2 block w-full"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Description"
              />
              <button
                className="bg-green-600 text-white px-3 py-1 mr-2 rounded"
                onClick={() => handleEdit(note._id)}
              >
                Save
              </button>
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setEditId(null)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">{note.title}</h3>
              <p>{note.description}</p>
              <p className="text-sm mt-1">
                Status: <strong>{note.status}</strong>
              </p>

              <div className="mt-2 space-x-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                  onClick={() => handleDone(note._id)}
                  disabled={note.status === 'done'}
                >
                  Done
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setEditId(note._id);
                    setEditForm({ title: note.title, description: note.description });
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(note._id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
