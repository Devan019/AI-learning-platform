import axios from 'axios'
import { Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()
  // const [first, setfirst] = useState(second)

  async function logout() {
    const api = await axios.get(`${import.meta.env.VITE_API}/auth/logout`,{
      withCredentials : true
    });
    const data = api.data;
    
    localStorage.removeItem("login");
    navigate("/home");
  }

  useEffect(()=>{
    async function main() {
      await logout();
    }
    main();
  })
  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <Loader />
    </div>
  )
}

export default Logout