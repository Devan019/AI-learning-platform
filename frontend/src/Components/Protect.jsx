import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Protect = ({ children }) => {
  const [islogin, setislogin] = useState(localStorage.getItem("login"))
  const navigate = useNavigate()

  useEffect(() => {
    if (!islogin) {
      navigate("/login")
    }
  }, [islogin, navigate])  

  return islogin ? children : null
}

export default Protect
