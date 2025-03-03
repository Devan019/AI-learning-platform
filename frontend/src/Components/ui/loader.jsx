import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./loader.css";

const Loader = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col bg-zinc-900 text-white fixed top-0 left-0 z-50">
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <div className="spinner1"></div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.1 }}
        className="text-4xl font-bold mt-6 text-blue-800/80"
      >
        <motion.span
          className="text-2xl "
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          AI is Generating Courses {dots}
        </motion.span>
      </motion.h1>
    </div>
  );
};

export default Loader;
