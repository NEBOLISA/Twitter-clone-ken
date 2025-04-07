import { signOut } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useUserStore } from '../store/useUserStore';
import { useRouter } from 'next/navigation';

const SidebarProfileOption = ({userName,ref}:{userName:string,ref:React.RefObject<null>}) => {
    const setUserInfo = useUserStore((state) => state.setUserInfo);
    const { userInfoStatus,  } = useUserStore(); 
      const router = useRouter()
      async function handleLogOut() {
            setUserInfo(null)
            await signOut()
    
        }
        useEffect(() => {
                if (userInfoStatus === "unauthenticated") {
                    router.push("/login");
                }
            }, [userInfoStatus]);
  return (
    <div ref={ref} className={`fixed lg:absolute md:left-3 left-4 bg-black  shadow-[rgba(255,255,255,0.2)_0px_0px_15px,rgba(255,255,255,0.18)_0px_0px_3px_1px] h-[200px] py-3 rounded-lg w-[250px] md:w-[280px] z-50  bottom-[7.2rem]  cursor-default before:content-['']  before:absolute before:bottom-[-10px] before:left-1/2 before:-translate-x-1/2 before:border-l-[8px] before:border-l-transparent before:border-r-[8px] before:border-r-transparent before:border-t-[8px] before:border-t-black `}>
     
      
      <p onClick={handleLogOut} className='text-lg p-2 pl-4 hover:bg-white/10 cursor-pointer font-medium text-white'>{`Log out @ ${userName}`}</p>
    </div>
  )
}

export default SidebarProfileOption
