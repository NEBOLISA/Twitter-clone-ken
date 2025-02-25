'use client'
import React from 'react'
import { ClientSafeProvider, signIn, useSession, } from 'next-auth/react';
const SignInButton = ({provider}: {provider: ClientSafeProvider}) => {
  
  return (
    <button onClick={async()=>{await signIn(provider?.id)}} className='bg-twitterWhite px-3 py-2 text-black rounded-full flex justify-center items-center gap-2'><img src="/google-icon.png" alt="" className='h-7'/>  Sign In with {provider?.name}</button>
  )
}

export default SignInButton
