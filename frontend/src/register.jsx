import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:6800/api/v1/user/register",
        { username, email, password },
        { withCredentials: true }
      );

      if (response.data.statusCode === 201) {
        navigate("/login");
      }

    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">Create Account</h2>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-xl hover:bg-pink-700 transition duration-300 shadow-md"
          >
            Register
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline hover:text-indigo-700"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
