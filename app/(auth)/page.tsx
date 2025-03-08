'use client'

import { useEffect, useState } from "react";
import UserNameForm from "../components/userNameForm";
import useUserInfo from "../hooks/useUserInfo";
import PostTweet from "../components/postTweet";
import axios from "axios";
import PostContent from "../components/postContent";
import en from 'javascript-time-ago/locale/en'

import TimeAgo from 'javascript-time-ago'

import { useAppContext } from "../contexts/AppContext";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../components/layout";
import LoadingPage from "../(public)/loadingPage";


TimeAgo.addLocale(en)
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
    commentsCount:number

}
interface RetweetType {
    postId: string;
}

export default function Home() {

    const { posts, setPosts } = useAppContext();
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)
    const { userInfo, userInfoStatus, setUserInfo, setUserInfoStatus } = useUserInfo()
    const [openOptionMenu, setOpenOptionMenu] = useState("")
    const router = useRouter()
    const { data: session } = useSession()
   
    useEffect(() => {


        getPosts()
    }, [userInfo])


    async function handleLogOut() {
        setUserInfo(null)
        await signOut()

    }

    const getPosts = async () => {
        if (!userInfo) {



            return;
        }
        const { data: postsResponse } = await axios.get("/api/posts", { params: { userId: userInfo?._id } });
       

        setPosts(postsResponse?.Posts);
    }

    useEffect(() => {
        if (userInfoStatus === "unauthenticated") {
            router.push("/login");
        }
    }, [userInfoStatus, router]);

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


            <div className=" min-h-screen max-h-screen overflow-y-auto relative ">


                <h1 className="font-bold text-lg p-4">
                    Home
                </h1>
                {userInfo && <PostTweet user={userInfo} onPost={() => { getPosts() }} />}
                <div className="">


                    {
                    posts.length > 0 && posts.map((post) => (
                        <div className="border-t relative  border-twitterBorder pl-5 pr-3 py-2" key={post?._id}>


                            <PostContent onLike={()=>{getPosts()}} isOptionsOpen={isOptionsOpen} post={post} setIsOptionsOpen={setIsOptionsOpen} openOptionMenu={openOptionMenu} setOpenOptionMenu={setOpenOptionMenu} />
                        </div>
                    ))}

                </div>
               
                <div onClick={handleLogOut} className="px-3  absolute bottom-2  left-[50%] -translate-x-[50%] py-1 w-max rounded-full bg-white"><button className="text-black font-semibold">Logout</button></div>
            </div>
        </>
    );
}
