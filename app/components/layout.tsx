import React from 'react'

import { ReactNode } from 'react';
import Sidebar from './sidebar';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className=' flex min-h-screen w-screen  '>
            <div className="w-[26%] flex  justify-center  border-l  border   border-twitterBorder ">
                {/* <Sidebar /> */}
                {/* <p>left</p> */}
                <Sidebar/>
            </div>
            <main className="flex-1">
                {children}
            </main>
            <div className="w-[28%] hidden md:block   border  border-r border-twitterBorder  ">

            </div>
        </div>
    )
}

export default Layout
