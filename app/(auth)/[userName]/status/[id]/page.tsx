"use client"
import { postsType } from '@/app/(auth)/page';
import Layout from '@/app/components/layout';
import PostContent from '@/app/components/postContent';
import TweetActionsMenu from '@/app/components/tweetActionsMenu';
import TweetReply from '@/app/components/tweetReply';
import { useAppContext } from '@/app/contexts/AppContext';
import useUserInfo from '@/app/hooks/useUserInfo';

import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";




const PostDetail = () => {

  const { id } = useParams()
  const [post, setPost] = useState<postsType | null>(null)
  const [isViewPostOptionsOpen, setIsViewPostOptionsOpen] = useState(false)
  const [replies, setReplies] = useState<postsType[]>()
  const { userInfo } = useUserInfo()
  const { menuRef, posts,setPosts } = useAppContext();
  const router = useRouter()
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [openOptionMenu, setOpenOptionMenu] = useState("")

  const getSinglePost = async () => {
     if(userInfo) {
      const response = await axios.get(`/api/posts?id=${id}`,{ params: { userId: userInfo?._id } })
    // const updatedPost = posts.find((pst: any) => pst?._id === response?.data?.post?._id)

    // if (updatedPost) {
    //   setPost(response?.data?.post);
    //   getReplies(updatedPost?._id)
    // }
   setPost(response?.data?.post);
   getReplies(response?.data?.post?._id)
    
     }
  }
  // useEffect(()=>{
   
  // },[response])
  useEffect(() => {
    if (!id) {

      return;
    }
    if (id) {
      getSinglePost()


    }
  }, [userInfo])
  const moveBack = () => {
    window.history.go(-1);
  }
  // const updatePost =async()=>{
   
  //   const response = await axios.get(`/api/posts?id=${id}`)
  //   console.log(response?.data?.post?.commentsCount)
  // setPost((prev)=>prev && ({...prev, ...response?.data?.post}))
  // }
  // useEffect(()=>{
  // updatePost()
  // },[replies])
  const getReplies = async (postId: string) => {
    const { data: postsResponse } = await axios.get("/api/posts", { params: { postId,userId:userInfo?._id } });
    setReplies(postsResponse?.Posts)


  }
  return (
    <>
      <div className=' min-h-screen max-h-screen overflow-y-auto '>
        <div className='flex items-center gap-8 mb-5 p-3'>

          <div onClick={moveBack}>
            <IoArrowBackOutline className='w-5 h-5 cursor-pointer' />
          </div>
          <h3 className='text-xl font-extrabold'>Post</h3>
        </div>

        {post ? <div className='relative p-3'>
          {isViewPostOptionsOpen && <TweetActionsMenu menuRef={menuRef} />}
          <PostContent post={post} postDetail isViewPostOptionsOpen={isViewPostOptionsOpen} setIsViewPostOptionsOpen={setIsViewPostOptionsOpen} />
        </div> : <div className='w-full h-screen flex items-center justify-center'>Loading...</div>}
        <div className='w-full'>
          <TweetReply userName={post?.author?.userName!} profilePic={userInfo?.image!} post={post!} refreshReplies={getSinglePost}  />

          {replies && replies.map((reply: postsType) => (
            <div key={reply?._id} className='mt-2 '>
              <div className='px-3'>

            
            <PostContent isOptionsOpen={isOptionsOpen} post={reply} setIsOptionsOpen={setIsOptionsOpen} openOptionMenu={openOptionMenu} setOpenOptionMenu={setOpenOptionMenu} />
            </div>
            <div className="  border-b border-twitterBorder mt-2  "></div>
            </div>
            
          ))}

        </div>
      </div>


    </>

  )
}


export default PostDetail
