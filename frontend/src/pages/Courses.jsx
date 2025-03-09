import { EvervaultCard } from "../Components/ui/evaultion-card";
import { Navbar } from "../Components/Nav";
// import courses from "../data/courses.data.json";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
const Courses = () => {

  const [courses, setCourses] = useState([]);

  async function getUser() {
    const api = await axios.get("http://localhost:8090/api/auth/user",{withCredentials:true});

    const user = api.data;

    return user.id;
  }

  async function getCourses(id){
    const api = await axios.get(`http://localhost:8090/api/courses/user/${id}`,{withCredentials: true});

    const courses = api.data;

    return courses;
  }

  useEffect(() => {
    async function fetchData() {
      const id = await getUser()
      const courses = await getCourses(id);
      console.log(courses)
      setCourses(courses)
    }
  
    fetchData();
  }, []);
  

  return (
    <div className="dark:bg-zinc-900 bg-gray-100 min-h-screen flex flex-col items-center py-10">
      <Navbar />

      <div className=" max-w-2xl px-6 mt-11">
        <h1 className="text-4xl font-bold dark:text-white text-black flex items-center gap-2 justify-center">
          📚 Explore Courses
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Enhance your skills with our wide range of courses covering web development, machine learning, cybersecurity, and more.
          Each course is designed to provide hands-on experience and practical knowledge.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {courses.map((course) => {
          return (
            <Link to={`${course.id}`} className="w-80" key={course.id}>
              <div className="border border-white/10 dark:bg-zinc-800 bg-white p-5 rounded-xl shadow-lg max-w-sm flex flex-col items-start transform transition duration-300 hover:scale-105 hover:shadow-xl" key={course.title}>
                <EvervaultCard text={course.title} className="h-[35vh]" />

                <h2 className="text-lg font-semibold mt-4 dark:text-white text-black flex items-center gap-2">
                  🎓 {course.title}
                </h2>

                <p className="text-sm mt-2 text-gray-400">{course.description}</p>

                <p className="text-sm font-medium border border-gray-600 rounded-full mt-4 px-3 py-1 text-gray-300">
                  📖 {course.level} Modules
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;