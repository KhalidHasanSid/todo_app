import React from 'react'
import axios from 'axios'
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Login() {
    const [username,setUsername]= React.useState('')
    const [password,setPassword]= React.useState()
      const navigate = useNavigate();


     const submit= async (e) => {
    e.preventDefault();
   

    try {
      const response = await axios.post(
        "http://localhost:6800/api/v1/user/login",
        { username, password },
        { withCredentials: true }
      );
        console.log("check",response)
        localStorage.setItem("uid", response.data.data);
       
     
      if(response.data.statusCode===200)
      navigate("/Notes");
    } catch (err) {
      console.error("Login error:", err);
    }
  };







  return (<><div>
    <label >Username:</label>
    <input type='text'  value={username} onChange= {(e) => setUsername(e.target.value)}></input>
      <label >Password:</label>
    <input type='password'  value={password} onChange= {(e) => setPassword(e.target.value)}></input>
    </div>
    <div>
       <button type='' onClick={submit}> </button>
      <Link to="/register">
     <button type="button">
          Register
     </button>
 </Link>
      
    </div>
   

    </>
  )
}
