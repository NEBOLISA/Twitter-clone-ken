"use client"
import React, { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

// import useUserInfo from '../hooks/useUserInfo'
import { useUserStore } from '../store/useUserStore'

const UserNameForm = () => {
 
    const { userInfo,userInfoStatus} = useUserStore(); 
    const [userName, setUserName] = useState("")
    const [isLoading,setIsLoading]= useState(false)
    const defaultUserName = userInfo?.email.split("@")[0]
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if(userName === ""){

            setUserName(defaultUserName?.replace(/[^a-zA-Z]/g, '') || "")
        }
            
        inputRef.current?.focus()
    }, [userInfo])

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
       await fetch('/api/users',{
        method:"PUT",
        headers:{'content-type':'application/json'},
        body:JSON.stringify({userName})
       }) .then(response => {
        if(response.status === 200){

            response?.json()?.then(json => {
                
                setIsLoading(false)
              router.refresh()
            })
        }
    })

       
      
    }
    if (userInfoStatus === "loading") {
        return ""
    }
    return (
        <div className='flex items-center justify-center h-screen'>
            <form className='text-center' onSubmit={handleFormSubmit}>
                <h1 className='text-xl'>Pick a username</h1>
                <input ref={inputRef} type="text" name="" id="" className='block mb-2 bg-twitterBorder px-3 py-1 rounded-full' placeholder='username' value={userName} onChange={e => setUserName(e.target.value)} />
                <button className='block bg-twitterBlue w-full rounded-full py-1'>{isLoading ? "Updating...":"Continue"}</button>
            </form>
        </div>
    )
}

export default UserNameForm
