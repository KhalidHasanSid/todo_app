import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Bin({ onClose }) {
  const [binNotes, setBinNotes] = useState([]);

  useEffect(() => {
    fetchBinNotes();
  }, []);

  const fetchBinNotes = async () => {
    try {
      const res = await axios.get('http://localhost:6800/api/v1/bin/getbintodo', {
        withCredentials: true,
      });
      setBinNotes(res.data.data);
    } catch (err) {
      console.error('Error fetching bin notes:', err);
    }
  };

  const handleRestore = async (noteId) => {
    try {
      const res = await axios.patch(
        `http://localhost:6800/api/v1/bin/restore/${noteId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.statusCode === 200) {
        // ✅ Only remove from UI if restore was successful
        setBinNotes((prev) => prev.filter((note) => note._id !== noteId));
      } else {
        console.warn("Restore failed:", res.data.message);
      }
    } catch (err) {
      console.error('Failed to restore note:', err);
    }
  };

  const handlePermanentDelete = async (noteId) => {
    try {
      const res = await axios.delete(`http://localhost:6800/api/v1/bin/delete/${noteId}`, {
        withCredentials: true,
      });

      if (res.data.statusCode === 200) {
        setBinNotes((prev) => prev.filter((note) => note._id !== noteId));
      } else {
        console.warn("Permanent delete failed:", res.data.message);
      }
    } catch (err) {
      console.error('Failed to delete permanently:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Bin</h2>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {binNotes.length === 0 ? (
          <p className="text-gray-500 text-center">No deleted notes.</p>
        ) : (
          binNotes.map((note) => (
            <div key={note._id} className="border p-4 mb-4 rounded bg-gray-50 shadow">
              <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
              <div
                className="text-gray-700 mt-2"
                dangerouslySetInnerHTML={{ __html: note.description }}
              />
              <div className="mt-3 space-x-2">
                <button
                  onClick={() => handleRestore(note._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Restore
                </button>
                <button
                  onClick={() => handlePermanentDelete(note._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
