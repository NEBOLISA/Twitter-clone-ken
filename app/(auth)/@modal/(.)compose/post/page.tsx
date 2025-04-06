"use client";

import { useRouter,} from "next/navigation";

import { IoCloseSharp } from "react-icons/io5";

import { format as timeAgo } from "timeago.js";
import { format } from 'date-fns';
import PostTweet from "@/app/components/postTweet";
import { useUserStore } from "@/app/store/useUserStore";
import { useEffect, useState } from "react";

const ComposePostModal = () => {
  const router = useRouter();
 const [postToReply, setPostToReply] = useState<any>(null);
   const [postDate, setPostDate] = useState<Date | null>(null);
   const { userInfo  } = useUserStore(); 
   useEffect(() => {
     const storedPost = localStorage.getItem("post");
     if (storedPost) {
       const parsedPost = JSON.parse(storedPost);
       setPostToReply(parsedPost);
       setPostDate(new Date(parsedPost.createdAt ?? Date.now()));
     }
   }, []);

  // const postToReply = JSON.parse(localStorage.getItem("post")!)
  // const postDate = new Date(postToReply?.createdAt ?? Date.now());
  const now = new Date();
  let timeDifference;
  if(postDate){
     timeDifference = (now.getTime() - postDate!.getTime()) / (1000 * 60 * 60);
  }
 
  
  return (
    <div className="fixed w-full inset-0 bg-[#5b708366] z-40 flex justify-center items-center">

      <div className="bg-black px-4 pt-4 pb-1 rounded-3xl lg:w-[40%] md:w-[80%] w-[95%] h-[90%]  ">

        <div className="w-full">
          <div className="flex justify-between items-start h-12 ">
            <div className="w-max p-[5px] cursor-pointer rounded-full  hover:bg-twiterLightGray/25">
              <IoCloseSharp onClick={() => router.back()} fontWeight={100} className="w-6 h-6  text-white" />
            </div>

            <h3 className="text-[#1d9bf0] font-bold text-[15px]">Drafts</h3>
          </div>

          <div className="flex items-center gap-4 mt-4 w-full">

            <div className='z-40 self-start'>
              <div className='rounded-full w-10 overflow-hidden' >

                <img src={postToReply?.author?.image} alt="" width="100" height="100" />
              </div>
            </div>


            <div className=' w-full'>
              <div className='flex  justify-between'>
                <div className='flex items-center  gap-1 flex-row flex-wrap '>

                  <div className='font-bold '>{postToReply?.author?.name}</div>


                  <div className={`flex items-center gap-1 `}>
                    <h3 className='text-md text-[#71767b] 
                                font-medium'>{`@${postToReply?.author?.userName} `}</h3>


                    <div className='flex gap-1  items-center '>
                      <div className=' text-md text-[#71767b] font-medium'>.</div>
                      {postToReply?.createdAt && <p className='text-sm text-[#71767b] font-medium'>{timeDifference! < 24 ? timeAgo(postDate!) : format(postDate!, "MMM d")}</p>}
                    
                    </div>
                  </div>


                </div>
              </div>


              <div className=" break-words break-all w-[90%]">
                {postToReply?.post}
              </div>
            </div>
          </div>
          <div className='h-16  border-l-2 border-[#333639]  left-[18px] relative -mt-8 '></div>
          <PostTweet user={userInfo!} modal
       
          />
        </div>



      </div>

    </div>
  );
};

export default ComposePostModal;
{/*   */ }