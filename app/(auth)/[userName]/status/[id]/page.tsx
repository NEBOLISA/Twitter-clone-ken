"use client"
import { postsType } from '@/app/(auth)/page';
import BackArrowNav from '@/app/components/backArrowNav';

import PostContent from '@/app/components/postContent';
import TweetReply from '@/app/components/tweetReply';
import { useAppContext } from '@/app/contexts/AppContext';

// import useUserInfo from '@/app/hooks/useUserInfo';
import { useUserStore } from '@/app/store/useUserStore';


import axios from 'axios';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { CSSProperties, useEffect, useState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader';
import { toast, ToastContainer } from 'react-toastify';

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};



const PostDetail = () => {

  const { id } = useParams()
  const [post, setPost] = useState<postsType | null>(null)
  const [isViewPostOptionsOpen, setIsViewPostOptionsOpen] = useState("")
  const [replies, setReplies] = useState<postsType[]>()
const { userInfo } = useUserStore(); 

 
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [openOptionMenu, setOpenOptionMenu] = useState("")
  // const [repliesIsLoading, setRepliesIsLoading] = useState(false)
 

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
  
  const getReplies = async (postId: string) => {
    try {
      // setRepliesIsLoading(true)
      const { data: postsResponse } = await axios.get("/api/posts", { params: { postId } });
      // setRepliesIsLoading(false);
      if (postsResponse.status < 200 || postsResponse.status >= 300) {
        // setRepliesIsLoading(false)
        const errorData = postsResponse.data;
        throw new Error(errorData.message);
      }
      setReplies(postsResponse?.Posts)
    } catch (error:any) {
      // setRepliesIsLoading(false)
     toast.error(`${error?.message}`, {
                         position: "top-right",
                         autoClose: 3000,
                         hideProgressBar: false, // Shows progress bar
                         closeOnClick: true,
                         pauseOnHover: true,
                         draggable: true,
                         progress: undefined,
                     });
    }
   


  }
  return (
    <>
    <ToastContainer/>
      <div className=' min-h-screen max-h-screen overflow-y-auto '>
       
       <BackArrowNav moveBack={moveBack} title='Post'/>

        {post ? <div className='relative p-3'>
          {/* {isViewPostOptionsOpen && <TweetActionsMenu menuRef={menuRef} />} */}
          <PostContent post={post} postDetail isViewPostOptionsOpen={isViewPostOptionsOpen} setIsViewPostOptionsOpen={setIsViewPostOptionsOpen} />
        </div> : <div className='w-full h-max  flex items-center justify-center'>
                <BeatLoader
                    size={15}
                    cssOverride={override}
                    color="#1d9bf0"
                    style={{ color: "#1d9bf0", display: "block" }}
                    aria-label="Loading Spinner"
                    data-testid="loader" /> 
              </div> }
        <div className='w-full'>
          {post && (
            <TweetReply 
              userName={post.author?.userName || ""} 
              profilePic={userInfo ? userInfo.image : ""} 
              post={post} 
              refreshReplies={getSinglePost} 
            />
          )}

          {
              ((replies )
                ? (replies?.length !== 0  
                  ?replies?.map((reply: postsType) => (
                      <div key={reply?._id} className='mt-2 '>
                            <div className='px-3'>
                              { <PostContent isOptionsOpen={isOptionsOpen} post={reply} setIsOptionsOpen={setIsOptionsOpen} openOptionMenu={openOptionMenu} setOpenOptionMenu={setOpenOptionMenu} /> }
                            </div>
                            <div className="  border-b border-twitterBorder mt-2  "></div>
                      </div>
                
                  ))
                  : 
                  <div className='w-full h-[50vh] flex justify-center items-center text-twiterLightGray text-lg'>No Replies</div>
                  )
                :
                
                <div className='w-full h-[50vh]  flex items-center justify-center'>
                <BeatLoader
                    size={15}
                    cssOverride={override}
                    color="#1d9bf0"
                    style={{ color: "#1d9bf0", display: "block" }}
                    aria-label="Loading Spinner"
                    data-testid="loader" /> 
              </div> 
          )}
         
        </div>
      </div>


    </>

  )
}


export default PostDetail
