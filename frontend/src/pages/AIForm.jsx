import React from 'react'
import { Navbar } from '../Components/Nav'
import {  Interest } from '../Components/MainForm'

const AIForm = () => {
  return (
    <div className='bg-black min-h-screen flex flex-col items-center justify-center'>
      <Navbar/>
      <div className='mt-16'>
      <Interest/>
      </div>
    </div>
  )
}

export default AIForm