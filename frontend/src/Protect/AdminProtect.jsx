import AdminLogin from '../pages/AdminLogin';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminProtect = ({ children }) => {
  const { obj } = useSelector((state) => state.getUser);
  const navigate = useNavigate();
  const [hasCheckedInitially, setHasCheckedInitially] = useState(false);

  useEffect(() => {

    if(localStorage.getItem("adminlogin")){
      localStorage.removeItem("adminlogin")
      location.reload()
    }
    // First check after initial render or data fetch
    if (!hasCheckedInitially) {
      setHasCheckedInitially(true);
      console.log("time")
      return;
    }

    console.log(obj)

    // Subsequent checks
    if (obj && obj?.role !== "ADMIN") {
      console.log("in if ", obj)
      navigate("/adminlogin");
    }
  }, [obj, hasCheckedInitially]);

  
  return (obj?.role === "ADMIN") ? children : <AdminLogin/>;
};

export default AdminProtect;