import React from 'react'
import { Navbar } from '../Components/Nav'
import { CombinedForm } from '../Components/MainForm'

const AIForm = () => {
  return (
    <div className='bg-zinc-900 min-h-screen flex flex-col items-center justify-center'>
      <Navbar/>
      <div className='mt-16'>
      <CombinedForm/>
      </div>
    </div>
  )
}

export default AIForm