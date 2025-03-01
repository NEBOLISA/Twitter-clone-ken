'use client'

import { useEffect, useState } from "react";
import UserNameForm from "./components/userNameForm";
import useUserInfo from "./hooks/useUserInfo";
import PostTweet from "./components/postTweet";
import axios from "axios";
import PostContent from "./components/postContent";
import en from 'javascript-time-ago/locale/en'

import TimeAgo from 'javascript-time-ago'

import { useAppContext } from "./contexts/AppContext";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "./components/layout";


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

    if (userInfoStatus === "loading") {


        return <div className="w-screen h-screen flex justify-center items-center">
            <div className="p-4 rounded-lg bg-[#0f0f0f]">
                <span className="block text-white">Loading...</span>
                Please wait while we retrieve all the information..
            </div>
        </div>
    }
    if (userInfo && !userInfo?.userName) {

        return <UserNameForm />
    }


    return (
        <Layout>


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
        </Layout>
    );
}
