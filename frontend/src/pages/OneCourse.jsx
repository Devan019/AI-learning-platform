import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../Components/Nav";
import axios from "axios";
import { motion } from "framer-motion";


const OneCourse = () => {
  const { courseid } = useParams();
  const [voices, setVoices] = useState([]);
  const [Content, setContent] = useState("");
  const [course, setCourse] = useState({
    id: "",
    title: "",
    description: "",
    contents: [],
  });
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechInstance, setSpeechInstance] = useState(null);
  const [speed, setSpeed] = useState(1); // Default speech speed

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  async function getContent() {
      console.log(courseid);
      const response = await axios.get(`${import.meta.env.VITE_API}/courses/${courseid}`,{withCredentials: true});
      console.log(response.data)
      return response.data;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const obj = await getContent();
        console.log(obj)
        let string = obj.title + obj.description;
        obj.contents.forEach((content) => {
          string += content.sectionTitle + content.body;
        });
        setContent(string);
        setCourse(obj);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseid]);

  const speakText = () => {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    // Stop previous speech
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(Content);

    // Select a female voice if available
    const femaleVoice = voices.find((voice) =>
      voice.name.includes("Female") || voice.name.includes("Zira") || voice.name.includes("Google UK English Female")
    );

    if (femaleVoice) {
      speech.voice = femaleVoice;
    }

    speech.rate = speed; // Apply the selected speed
    window.speechSynthesis.speak(speech);
    setSpeechInstance(speech);
    setIsPlaying(true);
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const resumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const changeSpeed = (event) => {
    const newSpeed = parseFloat(event.target.value);
    setSpeed(newSpeed);

    // If audio is playing, restart with new speed
    if (isPlaying) {
      speakText();
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 min-h-screen flex flex-col items-center justify-center text-white">
        <div className="text-2xl">Loading course...</div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 min-h-screen flex flex-col items-center text-white">
      <Navbar />
      <div className="w-3/5 mt-26">
        <h1 className="text-4xl font-bold text-center">
          📚 {course.title} 🎯
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <p className="text-lg leading-relaxed text-gray-300">
            {course.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 space-y-6"
        >
          <h2 className="text-2xl font-semibold text-indigo-400">
            📖 Course Contents
          </h2>

          {course.contents?.length > 0 ? (
            course.contents.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-l-4 border-indigo-400 pl-4"
              >
                <h3 className="text-xl font-semibold text-white">
                  {section.sectionTitle}
                </h3>
                <p className="text-gray-300 mt-2">{section.body}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400">No sections available for this course.</p>
          )}
        </motion.div>

        {/* Audio Control Buttons */}
        <div className="mt-10 flex gap-4">
          <motion.button
            onClick={speakText}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            🎵 Play Audio
          </motion.button>

          <motion.button
            onClick={pauseSpeech}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            ⏸ Pause
          </motion.button>

          <motion.button
            onClick={resumeSpeech}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            ▶ Resume
          </motion.button>

          <motion.button
            onClick={stopSpeech}
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            ⏹ Stop
          </motion.button>
        </div>

        {/* Speed Control */}
        <div className="mt-6">
          <label className="text-gray-300 mr-2">Speed:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={changeSpeed}
            className="cursor-pointer"
          />
          <span className="ml-2 text-gray-300">{speed.toFixed(1)}x</span>
        </div>

        <div className="mt-10">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium">
            <Link to={`/course/${course.id}/quiz`}>📝 Take Quiz</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OneCourse;
