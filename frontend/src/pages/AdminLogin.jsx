import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiKey, FiArrowRight, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { otpEmailTemplate } from '../../public/mailTempletes/sendotp';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: email/password, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Handle login form submission


  const generateOtp = async(admin) => {
    

    const response = await axios.post(`${import.meta.env.VITE_API}/admin/getotp`,admin, {withCredentials : true}); 

    const otp = response.data;
    if(otp == 0){
      alert("backend error")
      return
    }

    console.log("otp get "+ otp);

    const templateSendotp = otpEmailTemplate(admin.email, otp);
    const obj = {
      recipient: admin.email,
      msgBody: templateSendotp,
      subject: "verify your account !!!"
    }
    const api = await axios.post(`${import.meta.env.VITE_API}/sendMail`,obj, {withCredentials : true}); 

    console.log(api.data)
    setLoading(false);
    
  }

  const main = async(admin) => {
    await generateOtp(admin);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {

      const obj = {
        email : email,
        password : password
      }
      
      const response = await axios.post(`${import.meta.env.VITE_API}/admin/login`,obj, {withCredentials : true}); 
      
      const data = response.data;
      console.log(data)
      const obj2 = {
        ...data,
        otp: 0
      }
      
      if (!data.id) {
        throw new Error(data.message || 'Invalid credentials');
      }
      main(obj2);
      setStep(2);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    } 
  };

  // Handle OTP generation and sending
  const handleSendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and login
  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/admin/checkOtp`,{
        otp: otp
      }, {withCredentials : true})

      const data = response.data;

      if (data == null) {
        throw new Error(data.message || 'Invalid OTP');
      }

      // Store admin token and redirect to dashboard
      localStorage.setItem('adminlogin', true);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Home Navigation Button - Added above the login card */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 mb-4 ml-1"
        >
          <FiHome /> Go to Home
        </motion.button>

        <div className="bg-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-indigo-100 mt-1">
              {step === 1 ? 'Enter your credentials' : 'Verify your identity'}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-rose-900/50 text-rose-100 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {step === 1 ? (
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-zinc-300 text-sm mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-zinc-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="admin@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-zinc-300 text-sm mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-zinc-400" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading ? (
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <>
                        Continue <FiArrowRight />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              <form onSubmit={verifyOTP}>
                <div className="space-y-4">
                  {/* OTP Info */}
                  <div className="text-center mb-4">
                    <div className="mx-auto bg-zinc-700/50 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                      <FiKey className="text-indigo-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-zinc-100">OTP Verification</h3>
                    <p className="text-zinc-400 text-sm mt-1">
                      Enter the 6-digit code sent to {email}
                    </p>
                  </div>

                  {/* OTP Input */}
                  <div>
                    <label className="block text-zinc-300 text-sm mb-1">OTP Code</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiKey className="text-zinc-400" />
                      </div>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="123456"
                        required
                        maxLength={6}
                      />
                    </div>
                  </div>

                  {/* Resend OTP */}
                  <div className="text-center text-sm">
                    {otpSent ? (
                      <p className="text-emerald-400">OTP sent successfully!</p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={loading}
                        className="text-indigo-400 hover:text-indigo-300 underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  {/* Verify Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading ? (
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <>
                        Verify & Login <FiArrowRight />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}

            {/* Admin Request Link - Added below the form */}
            <div className="mt-6 text-center text-sm text-zinc-400">
              Need admin access?{' '}
              <a 
                href="mailto:admin@example.com" 
                className="text-indigo-400 hover:underline"
              >
                Request access via email
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-zinc-750 px-6 py-4 text-center">
            <p className="text-zinc-400 text-xs">
              Secure admin portal • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;