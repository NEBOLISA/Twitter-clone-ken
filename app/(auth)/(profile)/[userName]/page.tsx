"use client"

import ProfileComponent from '@/app/components/profileComponent'
import { useUserStore } from '@/app/store/useUserStore'
import { useParams } from 'next/navigation'
import React from 'react'

const Profile = () => {
  const moveBack = () => {
    window.history.go(-1);
  }
  const { userName } = useParams()
  const { userInfo} = useUserStore(); 
  const isUserProfile = userInfo?.userName === userName
  return (
    <div className='min-h-screen max-h-screen overflow-y-auto'>
   <ProfileComponent moveBack={moveBack} isUserProfile={isUserProfile} userName={userName ?userName?.toString():""}/>
   </div>
  )
}

export default Profile
