import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom'; 
import Login from './login.jsx';
import Protected from './protected.jsx';
import Layout from './Layout.jsx';
import Note from './Note.jsx';
import Register from './register.jsx';

function App() {
    const router = createBrowserRouter(
    createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
     <Route path="/" element={<Protected><Layout /></Protected>}>
          <Route path="Notes" element={<Note />} />
             </Route>
    </>))
  


  return <RouterProvider router={router} />;
  
}

export default App
