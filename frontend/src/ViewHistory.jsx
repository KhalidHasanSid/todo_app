

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ViewHistory({ noteId, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:6800/api/v1/revertHistory/viewHistory/${noteId}`, {
          withCredentials: true,
        });
        console.log("cheking view history res",res.data.data.viewHistory)

        setHistory(res.data.data.viewHistory.reverse());
      } catch (err) {
        console.error('Failed to fetch note history:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [noteId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Note History</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-bold text-lg"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p>No history found for this note.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((version, index) => (
              <li key={index} className="border p-4 rounded bg-gray-50">
                <h3 className="font-bold text-lg">Version:{version.prevVersion}</h3>

                <h3 className="font-bold text-lg">title: {version.prevtitle}</h3>
                <p className="text-gray-700">description: {version.prevdescription}</p>
                <p className="text-gray-700">status: {version.prevstatus}</p>
                <p className="text-sm text-gray-500">
                  Updated By: {version.updatedBy|| 'Unknown'} <br />
                
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
