import React from 'react'
import axios from 'axios'
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Register() {
    const [username,setUsername]= React.useState('')
     const [email,setEmail]= React.useState('')
    const [password,setPassword]= React.useState()


     const submit= async (e) => {
    e.preventDefault();
   

    try {
      const response = await axios.post(
        "http://localhost:6800/api/v1/user/register",
        { username,email, password },
        { withCredentials: true }
      );

     
     

      navigate("/hom");
    } catch (err) {
      console.error("Login error:", err);
    }
  };







  return (<>
    <label >Username</label>
    <input type='text'  value={username}  required={true}   onChange= {(e) => setUsername(e.target.value)}></input>
     <input type='text'  value={email}  required={true}   onChange= {(e) => setEmail(e.target.value)}></input>
    <input type='password'  value={password}  required={true} onChange= {(e) => setPassword(e.target.value)}></input>
    <button type='submit' onClick={submit}>  </button>

     <Link to="/login">
     <button type="button">
          Sign In
     </button>
 </Link>
    </>
  )
}
