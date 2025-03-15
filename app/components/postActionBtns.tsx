import React, { useEffect, useRef, useState } from 'react'
import { BsChat } from "react-icons/bs";
import { AiOutlineRetweet } from "react-icons/ai";

import { IoMdHeart } from "react-icons/io";
import { IoBookmarkSharp } from "react-icons/io5";

import { FiShare } from "react-icons/fi";
import { BiBarChart } from "react-icons/bi";
import axios from 'axios';

import useUserInfo from '../hooks/useUserInfo';
import RetweetMenu from './retweetMenu';

import { useAppContext } from '../contexts/AppContext';
import FlipNumbers from 'react-flip-numbers';
import { usePostContext } from '../contexts/PostContext';
import { postsType } from '../(auth)/page';
import Link from 'next/link';
import Router from 'next/router';
import { useRouter } from 'next/navigation';
interface PostActionBtnsProps {
    singlePost?: boolean
    post: postsType | undefined
    onLike?: () => void
    openOptionMenu: string

}
export interface PostStateProps {
    liked: boolean,
    likeNum: number,
    retweeted: boolean,
    retweetNum: number,
    bookmarked: boolean,
    commentsCount:number


}

const PostActionBtns = ({ post, onLike, singlePost }: PostActionBtnsProps) => {
    
    const { userInfo } = useUserInfo()
    const retweetMenuRef = useRef<HTMLDivElement>(null)
    const retweetButtonRef = useRef<HTMLDivElement>(null)
    const [openRetweetMenuopen, setOpenRetweetMenuOpen] = useState<string | undefined>("")
    const { postStates, updatePostState, setPostToReply } = usePostContext()
 const router = useRouter()

    let postState = postStates[post?._id! ] || { 
        liked: false, 
        likeNum: 0, 
        retweeted:false, 
        retweetNum:  0, 
        bookmarked: false, 
        commentsCount:0
    }
    // useEffect(() => {
    //    if (post?._id ) {
    //     // if (post?._id && !postStates[post?._id]) {
    //         updatePostState(post?._id, { 
    //             liked: post?.liked || false, 
    //             likeNum: post?.likes || 0, 
    //             retweeted: post?.retweeted || false, 
    //             retweetNum: post?.retweets || 0, 
    //             commentsCount:post?.commentsCount || 0,
    //             bookmarked: false })
    //     }
    // }, [post, postStates, updatePostState])
    useEffect(() => {
        if (post?._id) {
            updatePostState(post?._id, {
                liked: post?.liked || false,
                likeNum: post?.likes || 0,
                retweeted: post?.retweeted || false,
                retweetNum: post?.retweets || 0,
                commentsCount: post?.commentsCount || 0, 
                bookmarked: false
            });
        }
        
          
        
    }, [post]);
   
   
    const handleClickOutside = (event: MouseEvent) => {
        if (
            retweetMenuRef.current &&
            !retweetMenuRef.current.contains(event.target as Node) &&
            retweetButtonRef.current &&
            !retweetButtonRef.current.contains(event.target as Node)
        ) {
            setOpenRetweetMenuOpen("");
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    const handleLike = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!postState?.liked) {

            //setPostState((prev) => ({ ...prev, liked: true, likeNum: prev.likeNum + 1 }))
             updatePostState(post?._id!, { liked: true, likeNum: postState.likeNum + 1 })
            const response = await axios.post(`/api/posts/${post?._id}/like`, { userId: userInfo?._id });
            if (onLike) {
                onLike()
            }
            if (!response.data.success) {
               // setPostState((prev) => ({ ...prev, liked: false, likeNum: prev.likeNum - 1 }))
                updatePostState(post?._id!, { liked: false, likeNum: postState.likeNum - 1 })

            }


        } else {

            //setPostState((prev) => ({ ...prev, liked: false, likeNum: prev.likeNum - 1 }))
            updatePostState(post?._id!, { liked: false, likeNum: postState.likeNum - 1 })

            const response = await axios.post(`/api/posts/${post?._id}/unlike`, { userId: userInfo?._id });
            if (onLike) {
                onLike()
            }
            if (!response.data.success) {
                //setPostState((prev) => ({ ...prev, liked: true, likeNum: prev.likeNum + 1 }))
                updatePostState(post?._id!, { liked: true, likeNum: postState.likeNum + 1 })
            }

        }
    }

    const handleRetweet = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        let response: { data: { success: boolean } } | undefined;
        if (!postState.retweeted) {
            //setPostState((prev) => ({ ...prev, retweeted: true, retweetNum: prev.retweetNum + 1 }))
            updatePostState(post?._id!, { retweeted: true, retweetNum: postState.retweetNum + 1 })
            setOpenRetweetMenuOpen("");
            response = await axios.post(`/api/posts/retweet`, { userId: userInfo?._id, postId: post?._id });

            if (response && response.data.success === false) {
                //setPostState((prev) => ({ ...prev, retweeted: false, retweetNum: prev.retweetNum - 1 }))
                updatePostState(post?._id!, { retweeted: false, retweetNum: postState.retweetNum - 1 })
            }

        }

    }
    const handleUndoneRetweet = () => {
        if (postState.retweeted) {
            const undoRetweet = axios.put(`/api/posts/retweet`, { userId: userInfo?._id, postId: post?._id })
            console.log(undoRetweet)
            //setPostState((prev) => ({ ...prev, retweeted: false, retweetNum: prev.retweetNum - 1 }))
            updatePostState(post?._id!, { retweeted: false, retweetNum: postState.retweetNum - 1 })
            setOpenRetweetMenuOpen("");
        } else {
            //setPostState((prev) => ({ ...prev, retweeted: true, retweetNum: prev.retweetNum + 1 }))
            updatePostState(post?._id!, { retweeted: true, retweetNum: postState.retweetNum + 1 })

        }
    }
    const handleRetweetMenuToggle = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenRetweetMenuOpen(post?._id)
    }


    const handleBookmark = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!postState.bookmarked) {
            //setPostState((prev) => ({ ...prev, bookmarked: true }))
            updatePostState(post?._id!, { bookmarked: true })

        } else {
           // setPostState((prev) => ({ ...prev, bookmarked: false }))
            updatePostState(post?._id!, { bookmarked: false })

        }
    }
    const handleComposePost=()=>{
        router.push("/compose/post")
        localStorage.setItem("post",JSON.stringify(post ))
      
       setPostToReply(post!);
    // }
    }
    return (
        <div className={`relative flex items-center cursor-default   justify-between  ${!singlePost && "border-t border-b border-twitterBorder mt-3 p-2 "}`} onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
            {openRetweetMenuopen === post?._id && <RetweetMenu handleUndoneRetweet={handleUndoneRetweet} postState={postState} retweetMenuRef={retweetMenuRef} onclick={handleRetweet} />}

            <div onClick={()=>handleComposePost()}  className="text-md group text-[#71767b] cursor-pointer font-medium flex items-center gap-[.3px]">
                <div className="p-2 rounded-full transition-all duration-[200ms] flex justify-center items-center group-hover:bg-twitterBlue group-hover:bg-opacity-10">
                    <BsChat className="w-5 h-5 text-inherit transition-all duration-[200ms] group-hover:text-twitterBlue" />
                </div>
                <p className="text-sm -ml-[4px] transition-all duration-[200ms] group-hover:text-twitterBlue">{postState?.commentsCount}</p>
            </div>

            <div onClick={handleRetweetMenuToggle} ref={retweetButtonRef} className=' text-md z-20   text-[#71767b] cursor-pointer group font-medium flex items-center gap-[.3px]'>
                <div className='p-2 rounded-full transition-all duration-[200ms] flex justify-center items-center group-hover:bg-green-400  group-hover:bg-opacity-10'>

                    <AiOutlineRetweet className={`${postState.retweeted && 'text-green-400'} w-5 h-5 transition-all duration-[200ms] group-hover:text-green-400`} />
                </div>
                <div className={`${postState.retweeted && 'text-green-400'} text-sm -ml-[4px] transition-all duration-[200ms] group-hover:text-green-400`}><FlipNumbers height={12} width={12} color={`
                    ${postState.retweeted && "text-green-4"} `} play perspective={100} numbers={postState?.retweetNum.toString()} /></div>
            </div>
            <div onClick={handleLike}
                className=' text-md     text-[#71767b] cursor-pointer group font-medium flex items-center gap-[.3px]'>
                <div className='p-2 transition-all duration-[200ms]  rounded-full flex justify-center items-center group-hover:bg-pink-400  group-hover:bg-opacity-10'>

                    <IoMdHeart className={`${postState?.liked ? 'text-pink-600 fill-pink-600 stroke-[21px] stroke-pink-600' : "fill-transparent stroke-[21px] stroke-[#71767b] "} w-5 transition-all duration-[200ms]  h-5 group-hover:text-pink-600 group-hover:stroke-pink-600`} />
                </div>
                <div className={`${(postState?.liked === true) && 'text-pink-600'} text-[#71767b] text-sm -ml-[4px] transition-all duration-[200ms]  group-hover:text-pink-600`}><FlipNumbers height={12} width={12} color={`
                    ${postState.retweeted && "text-pink-600"} `} play perspective={100} numbers={postState?.likeNum.toString()} /></div>

            </div>

            {singlePost &&
                <>

                    <div className="text-md group text-[#71767b] cursor-pointer font-medium flex items-center gap-[.3px]">
                        <div className="p-2 rounded-full transition-all duration-[200ms] flex justify-center items-center group-hover:bg-twitterBlue group-hover:bg-opacity-10">
                            <BiBarChart className="w-5 h-5 text-inherit transition-all duration-[200ms] group-hover:text-twitterBlue" />
                        </div>
                        <p className="text-sm -ml-[4px] transition-all duration-[200ms] group-hover:text-twitterBlue">{postState?.commentsCount}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div onClick={handleBookmark} className=' text-md    text-[#71767b] cursor-pointer group font-medium flex items-center'>
                            <div className='p-2 transition-all duration-[200ms]  rounded-full flex justify-center items-center group-hover:bg-twitterBlue  group-hover:bg-opacity-10'>

                                <IoBookmarkSharp className={`${postState.bookmarked ? 'text-twitterBlue fill-twitterBlue stroke-[21px] stroke-twitterBlue' : "fill-transparent stroke-[21px] stroke-[#71767b] "} w-5 transition-all duration-[200ms] h-5 group-hover:text-twitterBlue  group-hover:stroke-twitterBlue `} />
                            </div>

                        </div>
                        <div className=' text-md    text-[#71767b] cursor-pointer group font-medium flex items-center'>
                            <div className='p-2 rounded-full flex justify-center items-center hover:bg-twitterBlue transition-all duration-[200ms]  hover:bg-opacity-10'>

                                <FiShare className='w-5 h-5 transition-all duration-[200ms] group-hover:text-twitterBlue ' />
                            </div>

                        </div>
                    </div>
                </>
            }



            {
                !singlePost &&
                <>
                    <div onClick={handleBookmark} className=' text-md    text-[#71767b] cursor-pointer group font-medium flex items-center'>
                        <div className='p-2 transition-all duration-[200ms]  rounded-full flex justify-center items-center group-hover:bg-twitterBlue  group-hover:bg-opacity-10'>

                            <IoBookmarkSharp className={`${postState.bookmarked ? 'text-twitterBlue fill-twitterBlue stroke-[21px] stroke-twitterBlue' : "fill-transparent stroke-[21px] stroke-[#71767b] "} w-5 transition-all duration-[200ms] h-5 group-hover:text-twitterBlue  group-hover:stroke-twitterBlue `} />
                        </div>

                    </div>
                    <div className=' text-md    text-[#71767b] cursor-pointer group font-medium flex items-center'>
                        <div className='p-2 rounded-full flex justify-center items-center hover:bg-twitterBlue transition-all duration-[200ms]  hover:bg-opacity-10'>

                            <FiShare className='w-5 h-5 transition-all duration-[200ms] group-hover:text-twitterBlue ' />
                        </div>

                    </div>
                </>

            }

        </div>
    )
}

export default PostActionBtns
