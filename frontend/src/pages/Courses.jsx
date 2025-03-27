import { EvervaultCard } from "../Components/ui/evaultion-card";
import { Navbar } from "../Components/Nav";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../Components/ui/Modal";
import Loader from "../Components/ui/loader";
import { Trash2 } from "lucide-react";

const Courses = () => {
  const [courseName, setCourseName] = useState("");
  const [courseLevel, setCourseLevel] = useState("Beginner");
  const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useSelector((state) => state.getUser);
  const { student } = useSelector((state) => state.getStudent);
  const [loading, setLoading] = useState(false);
  const [courseLimit, setcourseLimit] = useState(3)
  const [hasReachedCourseLimit, sethasReachedCourseLimit] = useState(0);
  const [isPremiumUser, setisPremiumUser] = useState("");



  async function getCourses() {
    try {
      const api = await axios.get(`${import.meta.env.VITE_API}/courses/user/${id}`, { withCredentials: true });
      console.log(api.data)
      return api.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  }

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await getCourses();
          
          // 1. Verify we have a string
          if (typeof response !== 'string') {
            setCourses(Array.isArray(response) ? response : []);
            return;
          }
      
          // 2. Advanced JSON repair
          const repairedJson = repairMalformedJson(response);
          
          // 3. Parse with nested error handling
          let parsedData;
          try {
            parsedData = JSON.parse(repairedJson);
          } catch (e) {
            console.error("Main parse failed, trying emergency extraction");
            parsedData = extractJsonFromString(response);
          }
      
          // 4. Final validation
          setCourses(Array.isArray(parsedData) ? parsedData : []);
          
        } catch (error) {
          console.error('Fetch error:', error);
          setCourses([]);
        } finally {
          setLoading(false);
        }
      };
      
      // Helper functions
      function repairMalformedJson(str) {
        // Fix common malformations
        return str
          .replace(/([{\[,])\s*([}\]])/g, '$1$2') // Remove empty objects/arrays
          .replace(/"\s*:\s*}/g, '":null}') // Fix empty values
          .replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas
      }
      
      function extractJsonFromString(str) {
        try {
          // Find the outermost JSON structure
          const jsonStart = Math.max(
            str.indexOf('['),
            str.indexOf('{')
          );
          const jsonEnd = Math.max(
            str.lastIndexOf(']') + 1,
            str.lastIndexOf('}') + 1
          );
          
          if (jsonStart >= 0 && jsonEnd > jsonStart) {
            const candidate = str.slice(jsonStart, jsonEnd);
            return JSON.parse(repairMalformedJson(candidate));
          }
          return [];
        } catch (e) {
          console.error("Emergency extraction failed");
          return [];
        }
      }
      fetchData();
    }

    if(id && student){
      sethasReachedCourseLimit(student.noOfGeneratedCourses >= courseLimit)
      setisPremiumUser(student.order_id)
      console.log(student, student.noOfGeneratedCourses, student.order_id)
      console.log(id)
    }
  }, [id, student]);

  async function generateCourse(id) {
    try {
      setLoading(true);
      const api = await axios.post(
        `${import.meta.env.VITE_API}/gemini/course/user/${id}`,
        { courseLevel, courseName }
      );
      let rawText = api.data.candidates[0].content.parts[0].text;
      let cleanedText = rawText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error("Error generating course:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function saveCourse(course) {
    try {
      const api = await axios.post(
        `${import.meta.env.VITE_API}/courses/user/${id}`,
        course,
        { withCredentials: true }
      );
      return api.data;
    } catch (error) {
      console.error("Error saving course:", error);
      throw error;
    }
  }

  const handleModalSubmit = async (newCourse) => {
    try {
      if (!id) {
        alert("User not authenticated");
        return;
      }

      const generatedCourse = await generateCourse(id);
      const savedCourse = await saveCourse(generatedCourse);

      setCourses(prevCourses =>
        Array.isArray(prevCourses)
          ? [...prevCourses, savedCourse]
          : [savedCourse]
      );

      setIsModalOpen(false);
      setCourseName("");
      setCourseLevel("Beginner");
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API}/courses/${courseId}`,
        { withCredentials: true }
      );

      // Remove the deleted course from state
      setCourses(prevCourses =>
        prevCourses.filter(course => course.id !== courseId)
      );
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (courseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (confirmDelete) {
      deleteCourse(courseId);
    }
  };

  useEffect(()=>{
    if(localStorage.getItem("CoursesRefresh")){
      localStorage.removeItem("CoursesRefresh")
      location.reload()
    }
  }, [])


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const courseVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <div className="dark:bg-zinc-900 bg-gray-100 min-h-screen flex flex-col items-center py-10">
      <Navbar />
      {loading && <Loader />}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl px-6 mt-11 text-center"
      >
        <h1 className="text-4xl font-bold dark:text-white text-black flex items-center gap-2 justify-center">
          📚 Explore Courses
        </h1>
        <p className="text-gray-500 mt-4 text-lg dark:text-zinc-400">
          Enhance your skills with our curated collection of cutting-edge courses in web development, machine learning, cybersecurity, and beyond.
        </p>
      </motion.div>

      {/* Upgrade message when course limit reached */}
      {!isPremiumUser && hasReachedCourseLimit && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 dark:text-red-400"
        >
          <span>You've already Generated  {courseLimit} courses. </span>
          <Link 
            to="/upgrade" 
            className="font-semibold underline hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            Upgrade your account
          </Link>
          <span> to create more courses.</span>
        </motion.div>
      )}


      {/* Enable button if premium user or under max courses */}
      <motion.button
        whileHover={{ scale: (isPremiumUser || !hasReachedCourseLimit) ? 1.05 : 1 }}
        whileTap={{ scale: (isPremiumUser || !hasReachedCourseLimit) ? 0.95 : 1 }}
        onClick={() => (isPremiumUser || !hasReachedCourseLimit) && setIsModalOpen(true)}
        className={`mt-6 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg ${
          (isPremiumUser || !hasReachedCourseLimit) 
            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/50" 
            : "bg-gray-400 dark:bg-zinc-700 text-gray-200 cursor-not-allowed"
        }`}
        disabled={!isPremiumUser && hasReachedCourseLimit}
      >
        {isPremiumUser ? "+ Create New Course (Premium)" : 
         !hasReachedCourseLimit ? "+ Create New Course" : "Course Limit Reached"}
      </motion.button>


      {loading ? (
        <div className="mt-12">
          <Loader />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-wrap justify-center gap-6 px-4"
        >
          <AnimatePresence>
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={courseVariants}
                  layout
                  className="w-80 relative"
                >
                  <Link to={`${course.id}`}>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)"
                      }}
                      className="border border-zinc-700 dark:bg-zinc-800 bg-white p-5 rounded-2xl shadow-lg max-w-sm flex flex-col items-start transition-all duration-300"
                    >
                      <button
                        onClick={(e) => handleDelete(course.id, e)}
                        className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors z-50"
                        aria-label="Delete course"
                      >
                        <Trash2 size={18} />
                      </button>
                      <EvervaultCard text={course.title} className="h-[35vh] w-full" />

                      <h2 className="text-lg font-semibold mt-4 dark:text-white text-black flex items-center gap-2">
                        🎓 {course.title}
                      </h2>

                      <p className="text-sm mt-2 text-zinc-500 dark:text-zinc-400">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between w-full mt-4">
                        <span className="text-sm font-medium border border-zinc-600 rounded-full px-3 py-1 text-zinc-300 bg-zinc-800">
                          📖 {course.level} Modules
                        </span>
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="text-2xl"
                        >
                          →
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-zinc-500 dark:text-zinc-400 mt-12 text-lg"
              >
                No courses found. Create your first course!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        courseLevel={courseLevel}
        courseName={courseName}
        setCourseLevel={setCourseLevel}
        setCourseName={setCourseName}
        levels={levels}
      />
    </div>
  );
};

export default Courses;