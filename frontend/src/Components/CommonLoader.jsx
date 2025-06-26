import React from 'react'
import RingLoader from './ui/RingLoader'

const CommonLoader = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full  bg-opacity-50 flex items-center justify-center z-50 bg-black">
      <RingLoader color="#fff" />
    </div>
  )
}

export default CommonLoader