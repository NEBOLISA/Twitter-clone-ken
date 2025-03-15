"use client";
import { postsType } from "@/app/(auth)/page";
import { usePostContext } from "@/app/contexts/PostContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import ReactTimeAgo from 'react-time-ago';
const ComposePostModal = () => {
  const router = useRouter();
 

  //const { postToReply } = usePostContext()
  const postToReply = JSON.parse(localStorage.getItem("post")!)

  return (
    <div className="fixed w-full inset-0 bg-[#5b708366] z-40 flex justify-center items-center">

      <div className="bg-black px-4 pt-4 pb-1 rounded-3xl w-[40%] h-[90%]  ">

        <div className="w-full">
          <div className="flex justify-between items-start h-12 ">
            <div className="w-max p-[5px] cursor-pointer rounded-full  hover:bg-twiterLightGray/25">
              <IoCloseSharp onClick={() => router.back()} fontWeight={100} className="w-6 h-6  text-white" />
            </div>

            <h3 className="text-[#1d9bf0] font-bold text-[15px]">Drafts</h3>
          </div>

          <div className="grid grid-cols-[10%_100%] mt-4 w-full">

            <div className='z-40 self-start'>
              <div className='rounded-full w-10 overflow-hidden' >

                <img src={postToReply?.author?.image} alt="" width="100" height="100" />
              </div>
            </div>


            <div className=' w-full'>
              <div className='flex  justify-between'>
                <div className='flex items-center gap-1 '>

                  <div className='font-bold '>{postToReply?.author?.name}</div>


                  <div className={`flex items-center gap-1 `}>
                    <h3 className='text-md text-[#71767b] 
                                font-medium'>{`@${postToReply?.author?.userName} `}</h3>


                    <div className='flex gap-1  items-center '>
                      <div className=' text-md text-[#71767b] font-medium'>.</div>
                    {postToReply?.createdAt &&  <ReactTimeAgo className='text-sm text-[#71767b] font-medium' date={postToReply?.createdAt!} locale="en-US" timeStyle="twitter" />}
                    </div>
                  </div>


                </div>
              </div>


              <div className=" break-words break-all w-[90%]">
                {postToReply?.post}
              </div>
            </div>
          </div>

        </div>



      </div>

    </div>
  );
};

export default ComposePostModal;
{/*   */ }