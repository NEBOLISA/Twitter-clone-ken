"use client"
import React from 'react'

import { ReactNode } from 'react';
import Sidebar from '../components/sidebar';
import useUserInfo from '../hooks/useUserInfo';

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const { userInfo,userInfoStatus } = useUserInfo()
    return (
        <div className=' flex min-h-screen w-screen  '>


          { 

          userInfoStatus !== "loading"?
           <>
            <div className="w-[26%] flex  justify-center  border-l  border   border-twitterBorder ">
                {/* <Sidebar /> */}
                {/* <p>left</p> */}
               <Sidebar userInfo={userInfo!}/>
            </div>
            <main className="flex-1 w-[46%]">
                {children}
            </main>
            <div className="w-[28%] hidden md:block   border  border-r border-twitterBorder  ">

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
