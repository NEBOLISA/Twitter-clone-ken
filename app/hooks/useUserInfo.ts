"use client"; 
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "../store/useUserStore";


export const useFetchUser = () => {
  const { data: session, status } = useSession();
  const { userInfo, setUserInfo, setUserInfoStatus, userInfoStatus } = useUserStore();

  useEffect(() => {
    const fetchUserInfo = async () => {
       
        //@ts-ignore
      if (!session?.user?.id) {
        setUserInfo(null);
        setUserInfoStatus("unauthenticated");
        return;
      }

      try {
        setUserInfoStatus("loading"); // Set loading state before fetching
       
         //@ts-ignore
        const res = await fetch(`/api/users?id=${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data.user); // Update Zustand store
          setUserInfoStatus("done");
        } else {
          setUserInfo(null);
          setUserInfoStatus("unauthenticated");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserInfo(null);
        setUserInfoStatus("unauthenticated");
      }
    };

    if (status === "authenticated" && !userInfo && userInfoStatus !== "done") {
      fetchUserInfo();
    }
  }, [session, status, userInfo, userInfoStatus]);
};















// "use client"
// import { useSession } from 'next-auth/react'
// import React, { useEffect, useState } from 'react'
// export interface UserInfo {
//     _id: string,
//     email: string,
//     name: string,
//     userName?: string
//     image:string
//     cover:string
//     [key: string]: any

// }  

//  const useUserInfo = () => {
   
   
//     const { data: session, status } = useSession()
//     const [userInfo, setUserInfo] = useState<UserInfo | null >()
//     const [userInfoStatus, setUserInfoStatus] = useState<"loading" | "done" | "unauthenticated">(
//         session ? "loading" : "unauthenticated")
//     const getUserInfo = async () => {
//         //@ts-ignore
//           if(!session?.user?.id){
//             setUserInfoStatus("unauthenticated")
//             return;
//           }
            
//         // @ts-ignore
//         const res = await fetch(`/api/users?id=${session?.user?.id}`)
//             .then(response => {
//                 if(response.status === 200){
                    
//                     response?.json()?.then(json => {
//                         setUserInfo(json?.user)
//                         setUserInfoStatus("done")
//                     })
//                 }
//             })
     

//     }
   
//     useEffect(() => {
     
//         if (userInfoStatus === "loading" && !userInfo) {
//             getUserInfo();
//         }

//     }, [status])
//     return { userInfo, status, userInfoStatus,setUserInfoStatus, setUserInfo }
// }

// export default useUserInfo
