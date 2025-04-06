import React from 'react'


const LoadingPage = () => {
    
  return (
    <div className="w-screen h-screen flex justify-center items-center">
            <div className="p-4 rounded-lg bg-[#0f0f0f]">
                <span className="block text-white">Loading...</span>
                Please wait while we retrieve all the information..
            </div>
        </div>
  )
}

export default LoadingPage
