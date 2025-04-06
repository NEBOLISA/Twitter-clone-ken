"use client"
import React from 'react'

import { ReactNode } from 'react';
import Sidebar from '../components/sidebar';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import useUserInfo from '../hooks/useUserInfo';
import { useUserStore } from '../store/useUserStore';
import { useFetchUser } from '../hooks/useUserInfo';
const AuthLayout = ({ children,modal,settingsModal }: { children: ReactNode,  modal:React.ReactNode,settingsModal: React.ReactNode; }) => {
    useFetchUser(); 
   const { userInfo, userInfoStatus } = useUserStore(); 
    return (
        <div className=' flex min-h-screen w-screen overflow-hidden '>


          { 

          userInfoStatus !== "loading"?
           <>
            <div className="lg:w-[26%] w-[15%] md:flex hidden  justify-center  border-l  border   border-twitterBorder ">
                {/* <Sidebar /> */}
                {/* <p>left</p> */}
               <Sidebar userInfo={userInfo!}/>
            </div>
            <main className="flex-1 lg:w-[46%] w-[52%]">
            <ToastContainer />
                {children}
                {modal}
                {settingsModal}
               
            </main>
            <div className="md:w-[22%] sm:w-[15%] w-0 md:flex hidden   border  border-r border-twitterBorder  ">

            </div>
            </> :
            <>
           
                {children}
           </>
            }
        </div>
    )
}

export default AuthLayout
