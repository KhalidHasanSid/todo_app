import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6800/api/v1/user/login",
        { username, password },
        { withCredentials: true }
      );
      console.log("check", response);
      localStorage.setItem("uid", response.data.data);
      if (response.data.statusCode === 200)
        navigate("/Notes");
    } catch (err) {
  if (err.response && err.response.status === 400) {
    setError("Incorrect username or password");
  } else {
    setError("Something went wrong. Please try again later.");
  }
  console.error("Login error:", err);
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Welcome Back</h2>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            Login
          </button>
        </form>
        {error && (
  <div className="mt-4 text-center text-red-600 font-medium">
    {error}
  </div>
)}

        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-pink-600 font-semibold hover:underline hover:text-pink-700"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
