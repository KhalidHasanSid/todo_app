import React from 'react'
import axios from 'axios'

export default function Register() {
    const [username,setUsername]= React.useState('')
     const [email,setEmail]= React.useState('')
    const [password,setPassword]= React.useState()


     const submit= async (e) => {
    e.preventDefault();
   

    try {
      const response = await axios.post(
        "http://localhost:3800/api/v1/user/register",
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
    <input type='text'  value={username} onChange= {(e) => setUsername(e.target.value)}></input>
     <input type='text'  value={email} onChange= {(e) => setEmail(e.target.value)}></input>
    <input type='password'  value={password} onChange= {(e) => setPassword(e.target.value)}></input>
    <button type='submit' onClick={submit}> </button>
    </>
  )
}
