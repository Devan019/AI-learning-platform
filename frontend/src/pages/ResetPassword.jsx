import React, { useEffect, useState } from 'react';
import Input from '../Components/ui/input';
import Label from '../Components/ui/label';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: '',
    newPassword: '',
    rePassword: '',
  });
  const [error, setError] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const resetToken = searchParams.get("resetToken");

  const setData = async () => {
    console.log(resetToken)
    const api = await axios(`${import.meta.env.VITE_API}/auth/resetToken/email/${resetToken}`)
    const data = api.data;
    console.log(data)
    setFormData((prev) => {
      return {
        ...prev,
        email: data
      }
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.rePassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API}/auth/changePassword`, {
        email: formData.email,
        password: formData.newPassword,
        resetToken : resetToken
      });
      alert('Password reset successful!');
      navigate('/login');
    } catch (error) {
      setError('Failed to reset password');
    }
  };

  const main = async () => {
    await setData();
  }

  useEffect(()=>{
    main()
  }, [])

  return (
    <div className='bg-zinc-900 min-h-screen flex flex-col items-center justify-center'>
      <FormContainer title='Reset Password' handleSubmit={handleSubmit}>
      
        <LabelInputContainer>
          <Label>Email</Label>
          <Input id='email' value={formData.email} readOnly className='bg-gray-800' />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label>New Password</Label>
          <Input id='newPassword' type='password' value={formData.newPassword} onChange={handleChange} required />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label>Confirm Password</Label>
          <Input id='rePassword' type='password' value={formData.rePassword} onChange={handleChange} required />
        </LabelInputContainer>

        {error && <p className='text-red-500 text-center'>{error}</p>}

        <div className='w-full flex justify-center mt-6'>
          <button
            type='submit'
            className='bg-purple-600 px-6 py-2 rounded-lg text-white hover:bg-purple-700 transition-all'
          >
            Reset Password
          </button>
        </div>
      </FormContainer>
    </div>
  );
};

const FormContainer = ({ title, handleSubmit, children }) => (
  <div className='mt-8 w-[40vw] mx-auto p-8 shadow-2xl border border-gray-700 rounded-xl bg-zinc-900 text-white'>
    <h2 className='font-bold text-3xl text-center mb-6'>{title}</h2>
    <form className='space-y-6' onSubmit={handleSubmit}>{children}</form>
  </div>
);

const LabelInputContainer = ({ children }) => (
  <div className='flex flex-col space-y-2 w-full'>{children}</div>
);

export default ForgotPassword;
