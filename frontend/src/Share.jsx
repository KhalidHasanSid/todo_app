import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Share({ noteId, onClose }) {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({}); // { userId: isEditable }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:6800/api/v1/shareTo/getUsers', {
        withCredentials: true,
      });
      console.log(res.data.data)
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) => {
      const updated = { ...prev };
      if (updated[userId]) {
        delete updated[userId];
      } else {
        updated[userId] = false; // default not editable
      }
      return updated;
    });
  };

  const toggleEditPermission = (userId) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleShare = async () => {
    const payload = Object.keys(selectedUsers).map((userId) => ({
      shareNote: noteId,
      shareWithUser: userId,
      isEditable: selectedUsers[userId],
    }));

    try {
      const res = await axios.post(
        'http://localhost:6800/api/v1/shareTo/shareNote',
        payload,
        { withCredentials: true }
      );
      alert('Note shared successfully!');
      onClose(); // close the share UI
    } catch (err) {
      console.error('Error sharing note:', err);
      alert('Failed to share note.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Share Note</h2>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between border-b pb-2"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.hasOwnProperty(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                />
                {user.username}
              </label>
              <button
                className={`text-sm px-2 py-1 rounded ${
                  selectedUsers[user._id]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-800'
                }`}
                disabled={!selectedUsers.hasOwnProperty(user._id)}
                onClick={() => toggleEditPermission(user._id)}
              >
                Can Edit
              </button>
            </div>
          ))}
        </div>

        <button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          onClick={handleShare}
          disabled={Object.keys(selectedUsers).length === 0}
        >
          Share
        </button>
      </div>
    </div>
  );
}
