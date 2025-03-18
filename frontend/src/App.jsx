import { Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import Chatbot from "./pages/Chatbot"
import Courses from "./pages/Courses"
import Roadmap from "./pages/Roadmap"
import OneCourse from "./pages/OneCourse"
import { Rewards } from "./pages/Reward"
import {Store} from "./pages/Store"
import Quiz from "./pages/Quiz"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Protect from "./Components/Protect"
import Logout from "./pages/Logout"
import AIForm from "./pages/AIForm"
const App = () => {
  return (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/chatbot" element={<Protect><Chatbot /></Protect>} />
    <Route path="/courses" element={<Protect><Courses /></Protect>} />
    <Route path="/roadmap" element={<Protect><Roadmap /></Protect>} />
    <Route path="/started" element={<Signup />} />
    {/* <Route path="/rewards" element={<Rewards />} />
    <Route path="/store" element={<Store />} /> */}
    <Route path="/courses/:courseid" element={<Protect><OneCourse /></Protect>} />
    <Route path="/course/:courseid/quiz" element={<Protect><Quiz /></Protect> } />
    <Route path="/interest" element={<Protect><AIForm /></Protect>} />
    <Route path="/login" element = {<Login/>} />
    <Route path="/logout" element = {<Logout/>} />
    <Route path="*" element={<Home />} />
  </Routes>
  )
}

export default App