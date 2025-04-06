'use client'

import { useEffect, useState } from "react";
import UserNameForm from "../components/userNameForm";

import PostTweet from "../components/postTweet";
import axios from "axios";
import PostContent from "../components/postContent";




import { useAppContext } from "../contexts/AppContext";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import LoadingPage from "../(public)/loadingPage";

// import useUserInfo from "../hooks/useUserInfo";
import { useUserStore } from "../store/useUserStore";



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
  
    const setUserInfo = useUserStore((state) => state.setUserInfo);


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
    return (
        <>


            <div className=" min-h-screen max-h-screen overflow-y-auto overflow-x-hidden relative ">


                <h1 className="font-bold text-lg p-4">
                    Home
                </h1>
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
