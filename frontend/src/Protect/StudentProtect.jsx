import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Protect = ({ children }) => {
  const { obj } = useSelector((state) => state.getUser);
  const navigate = useNavigate();
  const [hasCheckedInitially, setHasCheckedInitially] = useState(false);

  useEffect(() => {
    // First check after initial render or data fetch
    if (!hasCheckedInitially) {
      setHasCheckedInitially(true);
      return;
    }

    // If no user object exists, redirect to login
    if (!obj) {
      navigate("/login");
      return;
    }
    
    // If user exists but isn't a STUDENT, redirect to home
    if (obj.role !== "STUDENT") {
      navigate("/");
    }
  }, [obj, navigate, hasCheckedInitially]);

  // Only render children if user is a STUDENT
  return obj?.role === "STUDENT" ? children : null;
};

export default Protect;