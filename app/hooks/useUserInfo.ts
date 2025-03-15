"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
export interface UserInfo {
    _id: string,
    email: string,
    name: string,
    userName?: string
    image:string
    cover:string

}  

 const useUserInfo = () => {
   
   
    const { data: session, status } = useSession()
    const [userInfo, setUserInfo] = useState<UserInfo | null >()
    const [userInfoStatus, setUserInfoStatus] = useState<"loading" | "done" | "unauthenticated">(
        session ? "loading" : "unauthenticated")
    const getUserInfo = async () => {
        //@ts-ignore
          if(!session?.user?.id){
            setUserInfoStatus("unauthenticated")
            return;
          }
            
        // @ts-ignore
        const res = await fetch(`/api/users?id=${session?.user?.id}`)
            .then(response => {
                if(response.status === 200){
                    
                    response?.json()?.then(json => {
                        setUserInfo(json?.user)
                        setUserInfoStatus("done")
                    })
                }
            })
     

    }
    useEffect(() => {
        console.log({session})
        getUserInfo()

    }, [status])
    return { userInfo, status, userInfoStatus,setUserInfoStatus, setUserInfo }
}

export default useUserInfo
