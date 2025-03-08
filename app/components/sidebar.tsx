import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { RiTwitterXFill } from "react-icons/ri";

import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  SmartToy as GrokIcon,
  Groups as CommunitiesIcon,
  Star as PremiumIcon,
  Business as VerifiedOrgsIcon,
  AccountCircle as ProfileIcon,
  MoreHoriz as MoreIcon,
} from "@mui/icons-material";
import useUserInfo, { UserInfo } from '../hooks/useUserInfo';
import { useSession } from 'next-auth/react';
const menuItems = [
  {text:"",icon:<RiTwitterXFill className='w-8 h-8' /> },
    { text: "Home", icon: <HomeIcon sx={{ fontSize: 29 }} className='text-white ' /> },
    { text: "Explore", icon: <ExploreIcon sx={{ fontSize: 29 }} className='text-white'/> },
    { text: "Notifications", icon: <NotificationsIcon sx={{ fontSize: 29 }} className='text-white'/> },
    { text: "Messages", icon: <MessageIcon sx={{ fontSize: 29 }} className='text-white'/> },
    { text: "Grok", icon: <GrokIcon sx={{ fontSize: 29 }} className='text-white'/> },
    { text: "Communities", icon: <CommunitiesIcon sx={{ fontSize: 29 }} className='text-white'/> },
    { text: "Premium", icon: <PremiumIcon sx={{ fontSize: 29 }} className='text-white'/> },
    { text: "Verified Orgs", icon: <VerifiedOrgsIcon sx={{ fontSize: 29 }} className='text-white'/> },
    { text: "Profile", icon: <ProfileIcon sx={{ fontSize: 29 }} className='text-white'/> },
    { text: "More", icon: <MoreIcon sx={{ fontSize: 29 }} className='text-white'/> },
 
  ];
const Sidebar = ({userInfo}:{userInfo:UserInfo}) => {
    // const { data: session, status } = useSession()
  
   
  return (
   <div className='pt-4 flex flex-col w-full items-end space-y-2.5 min-h-screen max-h-screen overflow-y-auto '>
    
    <ul  className='flex flex-col w-2/3 h-full '>
      {menuItems.map((item, index) => (
         
          <li key={index} className="flex w-max items-center space-x-4 p-3 px-4 hover:bg-[#e7e9ea1a] rounded-full cursor-pointer">
          <span className="material-icons">{item.icon}</span>
                <span className="text-xl font-medium">{item.text}</span>
            </li>
        
      ))}
     
       
       </ul>
       <div className='flex flex-col w-2/3 h-full'>
      <div className='bg-twitterWhite mt-1 cursor-pointer  w-[90%] px-2 py-3 font-bold flex rounded-full justify-center text-black'>
        <button className='w-full h-full'>Post</button>
       </div>
       <div className='flex items-center justify-between w-[93%] mt-5 p-2 rounded-full hover:bg-[#e7e9ea1a] cursor-pointer'>
        <div className='flex items-center gap-2'>
       <img className='rounded-full  w-9 h-9' src={userInfo?.image} alt="profile"  />
        <div>
          <h3 className='font-bold text-white'>{userInfo?.name}</h3>
          <p className='text-gray-500 -mt-1'>{`@${userInfo?.userName}`}</p>
        </div>
        </div>
        
        <MoreIcon/>
      </div>
      </div>
      
    </div>
  )
}

export default Sidebar
