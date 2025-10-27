import React from 'react'
import { LuLoader } from "react-icons/lu";

const Loading = () => {
  return (
    <div className='grid place-content-center w-full h-screen bg-main'>
        <div className='w-full h-full animate-spin'>
            <LuLoader className='text-2xl text-primary'/>
        </div>
    </div>
  )
}

export default Loading
