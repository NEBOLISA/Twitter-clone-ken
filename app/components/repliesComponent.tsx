import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store/useUserStore';
import { postsType } from '../(auth)/page';
import PostContent from './postContent';
 interface CompPropType{
    replies:postsType[]
    Customkey:string
 }
const RepliesComponent = ({replies,Customkey}:CompPropType) => {
     const [isOptionsOpen, setIsOptionsOpen] = useState(false)
      const [openOptionMenu, setOpenOptionMenu] = useState("")
// const { userInfo, userInfoStatus } = useUserStore(); 
 
   const uniqueData = [...new Map(replies?.map(reply => [reply?.parent?.post, reply])).values()]

   const dis =[...new Map(replies?.map(reply => [reply?.parent?.post, reply])).values()]
 
//    console.log({uniqueData})

  return (
    <div key={Customkey} >
     {uniqueData.map((reply,index) => (
        <React.Fragment key={index *3} >
           <div key={index}  className='px-3 pt-1'>
            {reply?.parent && <PostContent  reply key={reply?.parent?._id} isOptionsOpen={isOptionsOpen} post={reply?.parent} setIsOptionsOpen={setIsOptionsOpen} openOptionMenu={openOptionMenu} setOpenOptionMenu={setOpenOptionMenu}/>}
            {reply && <PostContent key={reply?._id} isOptionsOpen={isOptionsOpen} post={reply} setIsOptionsOpen={setIsOptionsOpen} openOptionMenu={openOptionMenu} setOpenOptionMenu={setOpenOptionMenu}/>}
           </div>
            
            <div key={reply?.createdAt.toString()} className="  border-b border-twitterBorder mt-2  "></div>
        </React.Fragment>
       
     ))}
    </div>
  )
}

export default RepliesComponent
