"use client"
import React from 'react'

import { ReactNode } from 'react';
import useUserInfo from '../hooks/useUserInfo';

const LayoutDiv = ({ children }: { children: ReactNode }) => {
    const { userInfo, status, userInfoStatus } = useUserInfo()
  return (
     userInfo?.userName && <div className="max-w-lg mx-auto border border-l border-r border-twitterBorder min-h-screen">
      {children}
        </div>
     
   
  )
}

export default LayoutDiv
