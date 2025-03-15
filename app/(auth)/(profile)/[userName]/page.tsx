"use client"
import BackArrowNav from '@/app/components/backArrowNav'
import ProfileComponent from '@/app/components/profileComponent'
import { useParams } from 'next/navigation'
import React from 'react'

const Profile = () => {
  const moveBack = () => {
    window.history.go(-1);
  }
  const { userName } = useParams()
  return (
    <div className='min-h-screen max-h-screen overflow-y-auto'>
   <ProfileComponent moveBack={moveBack} userName={userName?.toString()!}/>
   </div>
  )
}

export default Profile
