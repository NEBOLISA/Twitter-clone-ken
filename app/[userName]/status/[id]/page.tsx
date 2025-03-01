"use client"
import Layout from '@/app/components/layout';
import PostContent from '@/app/components/postContent';
import TweetActionsMenu from '@/app/components/tweetActionsMenu';
import TweetReply from '@/app/components/tweetReply';
import { useAppContext } from '@/app/contexts/AppContext';
import useUserInfo from '@/app/hooks/useUserInfo';
import { postsType } from '@/app/page';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";



const PostDetail = () => {

  const { id } = useParams()
  const [post, setPost] = useState<postsType | null>(null)
  const [isViewPostOptionsOpen, setIsViewPostOptionsOpen] = useState(false)
  const { userInfo } = useUserInfo()
  const { menuRef, posts } = useAppContext();
  const router = useRouter()


  const getSinglePost = async () => {

    const response = await axios.get(`/api/posts?id=${id}`)
    const updatedPost = posts.find((pst: any) => pst?._id === response?.data?.post?._id)
    if (updatedPost) {
      setPost(updatedPost);
    }


  }
  useEffect(() => {
    if (!id) {

      return;
    }
    if (id) {
      getSinglePost()

    }
  }, [])
  const moveToHome = () => {
    router.replace("/")
  }

  return (
    <Layout>
   <div className='p-3 min-h-screen max-h-screen overflow-y-auto '>
      <div className='flex items-center gap-8 mb-5'>

        <IoArrowBackOutline className='w-5 h-5 cursor-pointer' onClick={moveToHome} />
        <h3 className='text-xl font-extrabold'>Post</h3>
      </div>

      {post ? <div className='relative'>
        {isViewPostOptionsOpen && <TweetActionsMenu menuRef={menuRef} />}
        <PostContent post={post} postDetail isViewPostOptionsOpen={isViewPostOptionsOpen} setIsViewPostOptionsOpen={setIsViewPostOptionsOpen} />
      </div> : <div className='w-full h-screen flex items-center justify-center'>Loading...</div>}
      <div className='w-full'>
    <TweetReply userName='kene' profilePic={userInfo?.image!}/>
    </div>
    </div>
   
    
    </Layout>
    
  )
}


export default PostDetail
