import { Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import Chatbot from "./pages/Chatbot"
import Courses from "./pages/Courses"
import Roadmap from "./pages/Roadmap"
import AIForm from "./pages/AIForm"
import OneCourse from "./pages/OneCourse"
import { Rewards } from "./pages/Reward"
import {Store} from "./pages/Store"
import Quiz from "./pages/Quiz"
const App = () => {
  return (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/chatbot" element={<Chatbot />} />
    <Route path="/courses" element={<Courses />} />
    <Route path="/roadmap" element={<Roadmap />} />
    <Route path="/started" element={<AIForm />} />
    <Route path="/rewards" element={<Rewards />} />
    <Route path="/store" element={<Store />} />
    <Route path="/courses/:courseTitle" element={<OneCourse />} />
    <Route path="/course/:courseTitle/quiz" element={<Quiz />} />
  </Routes>
  )
}

export default App