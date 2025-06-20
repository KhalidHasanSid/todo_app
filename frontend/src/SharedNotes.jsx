import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SharedNotes({ onClose }) {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    fetchSharedNotes();
  }, []);

  const fetchSharedNotes = async () => {
    try {
      const res = await axios.get('http://localhost:6800/api/v1/shareTo/getsharedNotes', {
        withCredentials: true,
      });
      console.log(res.data.data)
      setSharedNotes(res.data.data);
    } catch (err) {
      console.error('Error fetching shared notes:', err);
      alert('Failed to fetch shared notes');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (note) => {
    const isEditing = editingNoteId === note._id;

    if (isEditing) {
      // Save mode
      try {
        await axios.patch(
          `http://localhost:6800/api/v1/shareTo/updatesharedNote/${note.shareNote}`,
          editableData,
          { withCredentials: true }
        );
        alert('Note updated successfully!');
        setEditingNoteId(null);
        setEditableData({});
        fetchSharedNotes();
      } catch (error) {
        console.error('Error updating note:', error);
        alert('Update failed!');
      }
    } else {
      
      setEditingNoteId(note._id);
      setEditableData({
        title: note.title,
        description: note.description,
        status: note.status,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleStatus = () => {
    setEditableData((prev) => ({
      ...prev,
      status: prev.status === 'done' ? 'in-progress' : 'done',
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Shared With You</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : sharedNotes.length === 0 ? (
          <p className="text-center text-gray-500">No shared notes found.</p>
        ) : (
          sharedNotes.map((note) => {
            const isEditing = editingNoteId === note._id;
            const current = isEditing ? editableData : note;

            return (
              <div key={note.shareNote} className="border p-4 mb-4 rounded bg-gray-50 shadow-sm">
              <h3 className="font-bold">{note.sharefrom_name}</h3>

                <input
                  type="text"
                  name="title"
                  value={current.title || ''}
                  readOnly={!isEditing}
                  onChange={handleChange}
                  className={`w-full mb-2 px-3 py-2 border rounded ${
                    isEditing ? 'bg-white' : 'bg-gray-100'
                  }`}
                />

                <textarea
                  name="description"
                  value={current.description || ''}
                  readOnly={!isEditing}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded resize-none h-24 ${
                    isEditing ? 'bg-white' : 'bg-gray-100'
                  }`}
                />

              
                <button
                  onClick={toggleStatus}
                  disabled={!isEditing}
                  className={`mt-2 px-4 py-1 rounded font-semibold ${
                    isEditing
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Status: {current.status?.toUpperCase()}
                </button>

               
                {note.isEditable && (
                  <button
                    onClick={() => handleEditClick(note)}
                    className="mt-3 ml-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
