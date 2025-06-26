import { EvervaultCard } from "../Components/ui/evaultion-card";
import { Navbar } from "../Components/Nav";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../Components/ui/Modal";
import Loader from "../Components/ui/loader";
import { Trash2 } from "lucide-react";
import Alert from "../Components/ui/message";
import { fetchStudent } from "../store/StudentSlice/getStudentSlice";
import { AdminLink } from "../Components/AdminLink";
import CommonLoader from "../Components/CommonLoader";

const Courses = () => {
  const [courseName, setCourseName] = useState("");
  const [courseLevel, setCourseLevel] = useState("Beginner");
  const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id, obj } = useSelector((state) => state.getUser);
  const { student } = useSelector((state) => state.getStudent);
  const [loading, setLoading] = useState(false);
  const [isPremiumUser, setisPremiumUser] = useState("");
  const [alert, setAlert] = useState(null);
  const [courseLoading, setCourseLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function getCourses(id) {
    try {
      const api = await axios.get(`${import.meta.env.VITE_API}/courses/user/${id}`, { withCredentials: true });
      return api.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  }

  useEffect(() => {
    if (obj) {
      if (obj.role != 'STUDENT') {
        navigate("/home")
      }
    }


    if (id && student) {
      setisPremiumUser(student?.order_id)
      const fetchData = async () => {
        setLoading(true);
        const response = await getCourses(id);
        setCourses(response)
        setLoading(false);
      };
      fetchData();
    }
  }, [id, student]);

  // useEffect(() => {

  //   if (student) {
  //     setisPremiumUser(student.order_id);
  //     // Dispatch only when needed
  //     if (!student.order_id) { // Example condition
  //       dispatch(fetchStudent(id));
  //     }
  //   }
  // }, [student, obj?.role]);

  




  async function generateCourseAndSaved(id) {
    try {
      setCourseLoading(true);
      const api = await axios.post(
        `${import.meta.env.VITE_API}/gemini/course/user/${id}`,
        { courseLevel, courseName }, { withCredentials: true }
      );

      if (api.data == "") {
        return null;
      }

      let course = api.data;
      return course

    } catch (error) {
      console.error("Error generating course:", error);
      throw error;
    } finally {
      setCourseLoading(false);
    }
  }


  const handleModalSubmit = async () => {
    setAlert(null)
    try {
      if (!id) {
        setAlert({message : "User not authenticated"});
        return;
      }

      // Check if user has credits
      if (student.credits <= 0 && !isPremiumUser) {
        setAlert({ message: "You don't have enough credits. Please upgrade your plan", type: "warning" })
        return;
      }

      const generatedCourse = await generateCourseAndSaved(id);
      setIsModalOpen(false);
      setCourseName("");
      setCourseLevel("Beginner");

      if (generatedCourse == null) {
        setAlert({ message: "Error generating course. Please try again.", type: "error" })
        return;
      }

      // const savedCourse = await saveCourse(generatedCourse);

      setCourses(prevCourses =>
        Array.isArray(prevCourses)
          ? [...prevCourses, generatedCourse]
          : [generatedCourse]
      );

      dispatch(fetchStudent(id))

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
      setAlert({message : "Failed to delete course. Please try again.", type:"error"});
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
    <div className="dark:bg-black bg-gray-100 min-h-screen flex flex-col items-center py-10">
      <Navbar />
      <AdminLink />
      {courseLoading && <Loader />}
      {loading && <CommonLoader />}
      {alert && (
        <Alert message={alert.message} type={alert.type} />
      )}
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

      {/* Upgrade message when no credits left */}
      {student?.credits <= 0 && !isPremiumUser && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 dark:text-red-400"
        >
          <span>You don't have any credits left. </span>
          <Link
            to="/upgrade"
            className="font-semibold underline hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            Upgrade your account
          </Link>
          <span> to get more credits or premium access.</span>
        </motion.div>
      )}

      {/* Show remaining credits for non-premium users */}
      {!isPremiumUser && student?.credits > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-500 dark:text-blue-400"
        >
          <span>You have {student.credits} credit{student.credits !== 1 ? 's' : ''} remaining. </span>
          <Link
            to="/upgrade"
            className="font-semibold underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Upgrade to premium
          </Link>
          <span> for unlimited access.</span>
        </motion.div>
      )}

      {/* Enable button if premium user or has credits */}
      <motion.button
        whileHover={{ scale: (isPremiumUser || student?.credits > 0) ? 1.05 : 1 }}
        whileTap={{ scale: (isPremiumUser || student?.credits > 0) ? 0.95 : 1 }}
        onClick={() => (isPremiumUser || student?.credits > 0) && setIsModalOpen(true)}
        className={`mt-6 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg ${(isPremiumUser || student?.credits > 0)
          ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/50"
          : "bg-gray-400 dark:bg-zinc-700 text-gray-200 cursor-not-allowed"
          }`}
        disabled={!isPremiumUser && student?.credits <= 0}
      >
        {isPremiumUser ? "+ Create New Course" :
          student?.credits > 0 ? "+ Create New Course" : "No Credits Left"}
      </motion.button>

      {loading ? (
        <div className="mt-12">
          <CommonLoader />
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
                        className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors z-10"
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