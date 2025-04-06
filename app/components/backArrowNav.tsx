import React from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
interface ArrowBackCompPropTypes {
 moveBack:()=>void
 title:string | null
 profile?:boolean
 postsCount?:number
}

const BackArrowNav = ({moveBack,title="Tweet",profile,postsCount}:ArrowBackCompPropTypes) => {
 
  return (
    <div className={`flex  gap-8  pl-3 mb-1 `}>
      
          <div onClick={moveBack} className={` self-center `}>
            <IoArrowBackOutline className={`w-5 h-5 cursor-pointer`} />
          </div>
          <div>
          <h3 className='text-xl font-extrabold'>{title}</h3>
          {postsCount && <h3 className='text-twiterLightGray text-[13px] font-medium'>{`${postsCount} ${postsCount && postsCount<=1 ? "post" :"posts"}`} </h3>}
          </div>
        
        </div>
  )
}

export default BackArrowNav
