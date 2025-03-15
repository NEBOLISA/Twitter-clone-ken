import React from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
interface ArrowBackCompPropTypes {
 moveBack:()=>void
 title:string | null
 profile?:boolean
}

const BackArrowNav = ({moveBack,title="Tweet",profile}:ArrowBackCompPropTypes) => {
  return (
    <div className={`flex  gap-8  pl-3 mb-1 `}>
      
          <div onClick={moveBack} className={` self-center `}>
            <IoArrowBackOutline className={`w-5 h-5 cursor-pointer`} />
          </div>
          <div>
          <h3 className='text-xl font-extrabold'>{title}</h3>
          <h3 className='text-twiterLightGray text-[13px] font-medium'>172 posts</h3>
          </div>
        
        </div>
  )
}

export default BackArrowNav
