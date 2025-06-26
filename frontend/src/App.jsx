import { Route, Routes} from "react-router-dom"
import Chatbot from "./pages/Chatbot"
import Courses from "./pages/Courses"
import Roadmap from "./pages/Roadmap"
import OneCourse from "./pages/OneCourse"
import Quiz from "./pages/Quiz"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import AIForm from "./pages/AIForm"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchUser } from "./store/UserStore/setUserSlice"
import { fetchStudent } from "./store/StudentSlice/getStudentSlice"
import ForgotPassword from "./pages/ResetPassword"
import UpgradePage from "./pages/UpgradeCard"
import ProfilePage from "./pages/Profile"
import AdminDashboard from "./pages/AdminDashboard"
import AdminLogin from "./pages/AdminLogin"
import AdminProtect from "./Protect/AdminProtect"
import AI3D from "./pages/HomeUse3d"
import AppLoader from "./pages/HomeWithLoader"
import Dashboard from "./pages/Dashboard"


const App = () => {

  const dispatch = useDispatch()
  const {id} = useSelector((state) => state.getUser);
  const { student } = useSelector((state) => state.getStudent);
  useEffect(()=>{
    dispatch(fetchUser())
  }, [dispatch])


  useEffect(()=>{
    if(id){
      dispatch(fetchStudent(id))
    }
  }, [id,dispatch])

  return (
  <Routes>
    <Route path="/" element={<AppLoader />} />
    <Route path="/home" element={<AI3D />} />
    <Route path="/chatbot" element={<Chatbot />} />
    <Route path="/courses" element={<Courses />} />
    <Route path="/roadmap" element={<Roadmap />} />
    <Route path="/started" element={<Login />} />
    {/* <Route path="/rewards" element={<Rewards />} />
    <Route path="/store" element={<Store />} /> */}
    <Route path="/courses/:courseid" element={<OneCourse />} />
    <Route path="/course/:courseid/quiz" element={<Quiz /> } />
    <Route path="/interest" element={<AIForm />} />
    <Route path="/upgrade" element = {<UpgradePage />} />
    <Route path="/profile" element = {<Dashboard />} />
    <Route path="/login" element = {<Login/>} />
    <Route path="/logout" element = {<Logout/>} />
    <Route path="resetpassword" element = {<ForgotPassword />} />
    <Route path="/signup" element = {<Signup />} />
    <Route path="/admin" element = {<AdminProtect><AdminDashboard /></AdminProtect>} />
    <Route path="/adminlogin" element={<AdminLogin />} />
    <Route path="*" element={<AI3D />} />
  </Routes>
  )
}

export default App