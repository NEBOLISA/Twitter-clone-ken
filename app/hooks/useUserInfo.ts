import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
export interface UserInfo {
    _id: string,
    email: string,
    name: string,
    userName?: string
    image:string

}  

 const useUserInfo = () => {
   
   
    const { data: session, status } = useSession()
    const [userInfo, setUserInfo] = useState<UserInfo | null >()
    const [userInfoStatus, setUserInfoStatus] = useState<"loading" | "done" | "unauthenticated">("loading")
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
        getUserInfo()

    }, [status])
    return { userInfo, status, userInfoStatus,setUserInfoStatus, setUserInfo }
}

export default useUserInfo
