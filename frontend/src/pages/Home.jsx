import { useEffect, useRef, useState } from "react";
import { Spotlight } from "../Components/ui/spotlight";
import { Navbar } from "../Components/Nav";
import { TextGenerateEffect } from "../Components/ui/text-genrate";
import GLOBE from "vanta/dist/vanta.globe.min";
import * as THREE from "three";
import { motion } from "framer-motion";
import { FaBrain, FaRobot, FaGift } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const words = `Welcome to Smart AI based Learning Platform`;

const Home = () => {

  
  
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);
  const [showRenewalNotice, setShowRenewalNotice] = useState(false);
  const { id, email, loading, error, obj } = useSelector((state) => state.getUser);
  const { student } = useSelector((state) => state.getStudent);
  const navigate =  useNavigate();
  const [login, setlogin] = useState(localStorage.getItem("login"))

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x52556d,
          color2: 0x30344c,
          backgroundColor: 0x0d0e13,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);


  const sendRequsetToRenew = async() => {
     await axios.get(`${import.meta.env.VITE_API}/users/renew/${id}`);
  }
  useEffect(() => {
    if (id && student?.renew_date) {
      const today = new Date();
      const renewDate = new Date(student.renew_date);
      const diffTime = today - renewDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setShowRenewalNotice(diffDays)
      
      if(diffDays > 0){
        sendRequsetToRenew()
      }
      if(id && obj){
        if(obj.role == "ADMIN"){
          navigate("/");
        }
      }
    }
  }, [id, student, obj]);


  useEffect(()=>{
    setlogin(localStorage.getItem("login"))
  }, [login])

  useEffect(()=>{
    if(localStorage.getItem("HomeRefresh")){
      localStorage.removeItem("HomeRefresh");
      location.reload();
    }
  },[])

  

  

  return (
    <div className="w-full bg-[#0d0e13] text-white">
      {/* Renewal Notice */}
      {login && showRenewalNotice >= 0 && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4">
          <div>
            <p className="font-bold">Your subscription has expired!</p>
            <p>Please renew your plan to continue accessing premium features.</p>
          <div className="flex space-x-2">
            <button
              onClick={() =>(navigate("/upgrade"))}
              className="px-4 py-1 bg-white text-red-600 rounded hover:bg-gray-100 transition"
            >
              Renew
            </button>
            
          </div>
          </div>
        </div>
      )}

      {/* Vanta Background */}
      <div
        ref={vantaRef}
        className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      >
        <Navbar />
        <Spotlight />

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          {/* Animated Text */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <TextGenerateEffect
              words={words}
              className="text-white text-3xl md:text-5xl font-bold"
            />
          </motion.div>

          {/* Animated Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 20px rgba(255, 140, 0, 0.8)",
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all"
          >
            <Link to="/started">Get Started</Link>
          </motion.button>
        </div>
      </div>

      {/* Rest of your existing code... */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-12">
            🌟 Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              className="p-6 bg-gray-800 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FaBrain className="text-5xl text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                AI-Based Courses & Roadmap
              </h3>
              <p>
                Personalized AI-generated courses and structured learning paths
                for every student.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="p-6 bg-gray-800 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <FaRobot className="text-5xl text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                AI Chat for Doubt Solving
              </h3>
              <p>
                Instant AI-powered chatbot to help you solve doubts related to
                courses & roadmaps.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="p-6 bg-gray-800 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <FaGift className="text-5xl text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Earn Rewards for Completing Tasks
              </h3>
              <p>
                Stay motivated by earning points & rewards as you complete
                learning milestones.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 py-10 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-gray-400 text-sm">
            &copy; 2025 AI Learning Platform. All Rights Reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Built with ❤️ by Team Tabahi
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
