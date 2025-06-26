import { Navbar } from '../Components/Nav'
import React, { useState } from 'react'
import Label from '../Components/ui/label'
import Input from '../Components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Loader } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setuserdata } from '../store/UserStore/setUserSlice'
import Alert from '../Components/ui/message'
import { resetPasswordEmailTemplate } from '../helper/mailTempletes/resetpassword'
import { AdminLink } from '../Components/AdminLink'

const Login = () => {
  const [loading, setloading] = useState("hidden")
  const navigate = useNavigate();
  const [passworderror, setpassworderror] = useState("")
  const dispatch = useDispatch()
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "STUDENT",
    payment_date: null
  });

  const genrateToken = async () => {
    const api = await axios.get(`${import.meta.env.VITE_API}/auth/resetToken/${formData.email}`)

    return api.data;
  }

  const callForgotPassword = async () => {
    setloading("");
    const token = await genrateToken();
    const template = resetPasswordEmailTemplate(formData.email, token,import.meta.env.VITE_MAIL_REDIRECT || "http://localhost:3000");
    const api = await axios.post(`${import.meta.env.VITE_API}/sendMail`, {
      recipient: formData.email,
      msgBody: template,
      subject: "🔑 Reset Your Password - Action Required"
    })
    console.log(api.data)
    setloading("hidden")

  }

  const forgotPassword = async () => {
    const exitUser = await checkUser()
    if (!exitUser) {
      setAlert({message :"user is not exit", type :"warning"});
    } else {
      await callForgotPassword();
      setAlert({message : "🥳show your mail ✔️", type : "success"})
      
    }
  }

  const handelForgetPassword = () => {
    if (!formData.email) {
      setAlert({message : "enter your mail", type : "warning"})
    } else {
      forgotPassword()
    }
  }

  async function checkUser() {
    try {
      setAlert(null)
      const api = await axios.post(`${import.meta.env.VITE_API}/auth/login`, formData, { withCredentials: true });
      const data = api.data;
      return data;
    } catch (e) {
      // console.log(e.response.status)
      if(e?.response?.status == 401){
        setAlert({ message: "User doesn't exist", type: 'error' });
      }
      return ""
    }
  }


  async function main() {
    setloading("");
    const data = await checkUser();
    if (data == "") {
      return null;
    }
    else {
      localStorage.setItem("login", true);
      localStorage.setItem("HomeRefresh", true);
      navigate("/home");
    }
    dispatch(setuserdata({
      userd: data.id,
      email: data.email
    }))
    setloading("hidden");
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setpassworderror("")
  };


  const handleSubmit = (e) => {
    e.preventDefault();


    main();
  };
  return (
    <div className='bg-black min-h-screen flex flex-col items-center justify-center'>
      <Navbar />
      <AdminLink />
      {alert && (
        <Alert message={alert.message} type={alert.type} />
      )}

      <div className='mt-16'>
        <FormContainer
          loading={loading}
          title="Student Login"
          handleSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

            <LabelInputContainer>
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="your.email@example.com"
                className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="password"
                className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
                required
              />
            </LabelInputContainer>


          </div>
          {/* <div className="error text-red-600">{passworderror}</div> */}
          <div className="w-full flex justify-center mt-6">
            <button
              type="submit"
              className="relative inline-flex h-14 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-50 transform hover:scale-105 transition-all duration-300"
            >
              <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_25%,#6366F1_50%,#A855F7_75%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-900 px-8 py-2 text-base font-medium text-white backdrop-blur-3xl">
                Submit Profile 🚀
              </span>
            </button>
          </div>
          <Link to={"/signup"} className='text-center underline'>
            Don't have an account 🫡
          </Link>
          <button type='button' onClick={handelForgetPassword} className='float-right hover:underline hover:cursor-pointer'>
            Forgot Your password
          </button>
        </FormContainer>
      </div>
    </div>
  )
}



const FormContainer = ({ title, handleSubmit, children, loading }) => (
  <div className="mt-8 w-full sm:w-[60vw] lg:w-[40vw] mx-auto p-8 shadow-2xl border border-gray-700 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 text-white">
    <div className={`${loading}`}>
      <Loader />
    </div>
    <div className="flex items-center justify-center mb-8">
      <div className="h-1 w-10 bg-purple-500 rounded-full mr-3"></div>
      <h2 className="font-bold text-3xl text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
        {title}
      </h2>
      <div className="h-1 w-10 bg-purple-500 rounded-full ml-3"></div>
    </div>
    <a href={`${import.meta.env.VITE_API}/google/oauth`}>Google</a>

    <form className="space-y-6" onSubmit={handleSubmit}>
      {children}
    </form>
  </div>
);

const LabelInputContainer = ({ children }) => (
  <div className="flex flex-col space-y-2 w-full">{children}</div>
);
export default Login