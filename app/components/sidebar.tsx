import React, { useEffect, useRef, useState } from 'react'
import Image from "next/image";
import { RiTwitterXFill } from "react-icons/ri";
import { BsFeather } from "react-icons/bs";

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

import { useSession } from 'next-auth/react';
import { UserInfo, useUserStore } from '../store/useUserStore';
import ProfileComponent from './profileComponent';
import Profile from '../(auth)/(profile)/[userName]/page';
import { useRouter } from 'next/navigation';
import SidebarProfileOption from './sidebarProfileOption';
// import { UserInfo } from '../hooks/useUserInfo';

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
    const router = useRouter();
  const[isSideOptioOpen, setIsSideOptionOpen]=useState<boolean>(false)
  const menuRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
        setIsSideOptionOpen(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleNavigatePage = (text:string)=>{
   
      switch (text) {
        case "Profile":
          router.push(`/${userInfo.userName}`);
          break;
        
        case "Home":
          router.push("/");
          break;
      
        // case "Messages":
        //   router.push("/messages");
        //   break;
      
        // case "Settings":
        //   router.push("/settings");
        //   break;
      
        // case "Notifications":
        //   router.push("/notifications");
        //   break;
      
        default:
          console.warn("Unknown navigation option:", text);
      }
      

    
   
  }
    const handleSidebarOpen=()=>{
      setIsSideOptionOpen(!isSideOptioOpen)
    }
  return (
   <div className='pt-4 flex flex-col w-full items-end space-y-2.5 min-h-screen max-h-screen overflow-y-auto relative'>
    
    <ul  className='flex flex-col w-2/3 h-full lg:items-start items-end'>
      {menuItems.map((item, index) => (
         
          <li key={index} onClick={()=>handleNavigatePage(item.text)} className="flex  w-max items-center space-x-4 p-3 px-4 hover:bg-[#e7e9ea1a] rounded-full cursor-pointer">
          <span className="material-icons">{item.icon}</span>
                <span className="text-xl font-medium hidden lg:block">{item.text}</span>
            </li>
        
      ))}
       <div className='p-3 lg:hidden  '>
                <div className='w-8 h-8   rounded-full bg-twitterWhite flex items-center justify-center'>
                    <BsFeather className='w-4 h-4 text-black' />
                </div>
       </div>
       </ul>
       <div className='flex flex-col w-2/3 h-full relative '>
       {isSideOptioOpen && <SidebarProfileOption ref={menuRef} userName={userInfo?.name ?? null }/>}
      <div className='hidden  bg-twitterWhite mt-1 cursor-pointer  w-[90%] px-2 py-3 font-bold lg:flex rounded-full justify-center text-black'>
        <button className='w-full h-full '>Post</button>
        
       
       </div>
      
       <div className='flex lg:items-center  lg:justify-between justify-end lg:w-[93%] w-full mt-5 lg:p-2 p-3 rounded-full hover:bg-[#e7e9ea1a] cursor-pointer'>
        <div onClick={handleSidebarOpen} className='lg:flex block items-center  gap-2 '>
            <img className='rounded-full   w-9 h-9' src={userInfo?.image} alt="profile"  />
            <div className='lg:block hidden'>
              <h3 className='font-bold text-white'>{userInfo?.name}</h3>
              <p className='text-gray-500 -mt-1'>{`@${userInfo?.userName}`}</p>
            </div>
        </div>
        
        <MoreIcon className='lg:block hidden'/>
      </div>
      </div>
      
    </div>
  )
}

export default Sidebar
