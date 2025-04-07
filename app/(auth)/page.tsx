'use client'

import { useEffect, useState } from "react";
import UserNameForm from "../components/userNameForm";

import PostTweet from "../components/postTweet";
import axios from "axios";
import PostContent from "../components/postContent";

import { GiHamburgerMenu } from "react-icons/gi";



import { useAppContext } from "../contexts/AppContext";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import LoadingPage from "../(public)/loadingPage";

// import useUserInfo from "../hooks/useUserInfo";
import { useUserStore } from "../store/useUserStore";
import Sidebar from "../components/sidebar";
import { IoCloseSharp } from "react-icons/io5";



export interface postsType {

    author: {
        image: string
        name: string
        userName: string
        email: string
    },
    createdAt: number | Date
    post: string,
    likes: number
    _id: string
    liked?: boolean
    retweets: number
    retweeted?: boolean,
    commentsCount:number,
    parent:postsType,
    images?:[string]
 
}


export default function Home() {
    
    const { posts, setPosts } = useAppContext();
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)
   
    const [openOptionMenu, setOpenOptionMenu] = useState("")
    const router = useRouter()
     const [isSidebarOpen, setIsSideBarOpen] = useState(false)
   // const setUserInfo = useUserStore((state) => state.setUserInfo);


    const { userInfo, userInfoStatus,  } = useUserStore(); 
   
   




    useEffect(() => {
    
       
        getPosts()
    }, [userInfo])

   

    const getPosts = async () => {
        if (!userInfo) {



            return;
        }
  
 
        const { data: postsResponse } = await axios.get("/api/posts");
       

        setPosts(postsResponse?.Posts);
    }
    
    useEffect(() => {
       
        if (userInfoStatus === "unauthenticated") {
            router.push("/login");
        }
    }, [userInfoStatus]);

    if (posts.length === 0 &&  userInfoStatus === "loading") {

       
        return <LoadingPage/>
    }
    if (userInfo && !userInfo?.userName) {

        return <UserNameForm />
    }

    if (userInfoStatus === undefined) {
        return null; 
      }
      const openSidebar = ()=>{
        setIsSideBarOpen(true)
       
       
      }
      const handleSidebarClose = ()=>{
        setIsSideBarOpen(false)
        
      }
    return (
        <>


            <div className=" min-h-screen max-h-screen overflow-y-auto overflow-x-hidden relative ">
                 {
                     <div className={`${isSidebarOpen ? "translate-x-0 opacity-100 visible" : "-translate-x-full opacity-0 invisible"} h-full transition-all duration-300 transform fixed left-0 top-0 bottom-0 sm:w-[80%] bg-black w-[90%] z-50`}
>
                         <Sidebar userInfo={userInfo!} isSidebarOpen={isSidebarOpen}  setIsSideBarOpen={setIsSideBarOpen} handleSidebarClose={handleSidebarClose}   />
                        
                                                   
                    </div>

                 }
                 <div className="flex items-center justify-start md:block md:pl-0 gap-6 pl-3">
                 <GiHamburgerMenu className="w-7 h-7 md:hidden" onClick={openSidebar}/>

                 <h1 className="font-bold text-lg p-4">
                    Home
                </h1>
                 </div>
               
                 <PostTweet user={userInfo!} onPost={() => { getPosts() }} />
                <div className="">


                    {
                    posts.length > 0 && posts.map((post) => (
                        <div className="border-t relative  border-twitterBorder pl-5 pr-3 py-2" key={post?._id}>


                            <PostContent onLike={()=>{getPosts()}} isOptionsOpen={isOptionsOpen} post={post} setIsOptionsOpen={setIsOptionsOpen} openOptionMenu={openOptionMenu} setOpenOptionMenu={setOpenOptionMenu} />
                        </div>
                    ))}

                </div>
               
               
            </div>
        </>
    );
}
