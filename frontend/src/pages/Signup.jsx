import { Navbar } from '../Components/Nav'
import React, { useState } from 'react'
import Label from '../Components/ui/label'
import Input from '../Components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Loader } from 'lucide-react'
import { signupEmailTemplate } from '../../public/mailTempletes/signup'

const Signup = () => {
  const [loading, setloading] = useState("hidden")
  const navigate = useNavigate();
  const [passworderror, setpassworderror] = useState("")


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    repassword: "",
  });

  async function dosignup(){
    const api = await axios.post(`${import.meta.env.VITE_API}/auth/signup`,formData);

    const data = api.data;
    
    return data;

  }

  async function sendSignupMail(){
    const signupTemlate = signupEmailTemplate(formData.fullName, formData.email, "http://localhost:5173");
    const api = await axios.post(`${import.meta.env.VITE_API}/sendMail`,{
      recipient : formData.email,
      msgBody : signupTemlate,
      subject : "🔥 You're In! Welcome to AI_LEARNING_PLATFORM"
    })

    return api.data;
  }

  async function main() {
    setloading("");
    const data = await dosignup();
    console.log("data is " + data + typeof(data))
    if(data != ""){
      await sendSignupMail()
      setloading("hidden");
      navigate("/login");
    }else{
      setloading("hidden");
      alert("user already exit");
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setpassworderror("")
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    

    if (formData.password != formData.repassword) {
      setpassworderror("password should match")
      return;
    }

    main();
  };
  return (
    <div className='bg-zinc-900 min-h-screen flex flex-col items-center justify-center'>
      <Navbar />
      <div className='mt-16'>
        <FormContainer
          loading={loading}
          title="Student Signup"
          handleSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <LabelInputContainer>
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                type="text"
                placeholder="Enter your name"
                className="border-transparent bg-gray-800 focus:border-purple-500 transition-all duration-300"
                required
              />
            </LabelInputContainer>
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
            <LabelInputContainer>
              <Label htmlFor="repassword">
                Re-password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="repassword"
                value={formData.repassword}
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
          <Link to={"/login"} className='text-center underline'>
            Already have an account 🫡
          </Link>

        </FormContainer>

      </div>
    </div>
  )
}



const FormContainer = ({ title, handleSubmit, children, loading }) => (
  <div className="mt-8  w-[40vw] mx-auto p-8 shadow-2xl border border-gray-700 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 text-white">
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      {children}
    </form>
  </div>
);

const LabelInputContainer = ({ children }) => (
  <div className="flex flex-col space-y-2 w-full">{children}</div>
);
export default Signup