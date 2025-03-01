import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import MediaComponent from './mediaComponent';
import EmojiPicker from './emojiPicker';
import { useAppContext } from '../contexts/AppContext';

import { MdCancel } from "react-icons/md";
import { usePostContext } from '../contexts/PostContext';
interface TweetReplyProps {
    userName: string
    profilePic: string | null
}
const TweetReply = ({ userName, profilePic = null }: TweetReplyProps) => {
    const [inputIsFocused, setInputIsFocused] = useState<boolean>(false)
    const { replyEmojiRef, file, replyFile, setReplyFile, replyPreview, setReplyPreview } = useAppContext()
    const { emojiBoxOpen, replyText, setReplyText,setEmojiBoxOpen,replyEmojiBoxOpen, setReplyEmojiBoxOpen } = usePostContext()
    const handleClickOutside2 = (event: MouseEvent) => {
     
              if (
                replyEmojiRef.current &&
                  //@ts-ignore
                  !replyEmojiRef.current.contains(event.target as Node) 
                 &&
                 !(event.target as HTMLElement).closest(".emoji-button") 
              
              ) {
                  setReplyEmojiBoxOpen!(false)
                  
              }
          };
      
      
          useEffect(() => {
              document.addEventListener("mousedown", handleClickOutside2);
              return () => {
                  document.removeEventListener("mousedown", handleClickOutside2);
              };
          }, []);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
      //console.log({replyEmojiBoxOpen})
  
    //  useEffect(()=>{
    //   setEmojiBoxOpen(false)
    //  },[])

    const handleReplyInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
        setReplyText(event.target.value)
    };
    const handleCancel = () => {
        setReplyPreview("")
        setReplyFile(null)
    }
    
    
    return (
        <div className=''>
            {inputIsFocused ? <div className='text-white py-2   px-3'>
                <div className='flex flex-col '>
                    <div className='flex gap-3 mb-2'>
                        <div className='w-10 '></div>
                        <p className='mb-2 text-md text-[#71767b] font-medium'>Replying to <span className='text-twitterBlue'>@{userName}</span></p>
                    </div>

                    <div className='flex items-start gap-3 w-full '>
                        {profilePic && <div className='rounded-full   w-10 overflow-hidden' >

                            <img src={profilePic} alt="profile" className=' ' width="100" height="100" />
                        </div>}
                        <div className='w-full relative'>
                            <textarea ref={textareaRef} value={replyText} onFocus={() => setInputIsFocused(true)} onChange={handleReplyInput} className='resize-none overflow-hidden bg-transparent border-none outline-none text-white w-full placeholder:text-[#71767b] text-xl  placeholder:text-xl' placeholder='Post your reply' />
                            {replyPreview && <div className="mt-2 relative ">
                                <MdCancel onClick={handleCancel} className='absolute w-9 h-9  text-[#787a7a] cursor-pointer top-2 right-2 z-30' />

                                {replyFile?.type.startsWith("image/") ? (
                                    <img src={replyPreview} alt="Preview" className="max-w-full  w-full h-full rounded-lg" />
                                ) : (
                                    <video src={replyPreview} controls className="max-w-full h-full w-full rounded-lg" />
                                )}

                            </div>}
                            <div className='flex items-center justify-between relative'>

                                <MediaComponent isReplyPage />
                                <div className='w-full flex justify-end'>
                                    <div className={`rounded-full  items-end w-max    ${replyText.length > 0 ? "bg-white" : "bg-[#787a7a]"}  text-[#000000] px-4 py-2`}>
                                        <button className='font-bold'>Reply</button>
                                    </div>
                                </div>

                                {
                                    replyEmojiBoxOpen &&
                                    <div className='w-max absolute top-12  ' >
                                        <EmojiPicker replyEmojiRef={replyEmojiRef} isReplyPage />
                                    </div>

                                }
                            </div>

                        </div>

                    </div>
                </div>
            </div> :
                <div className='flex w-full justify-center items-center gap-3 px-3'>
                    {profilePic && <div className='rounded-full   w-10 overflow-hidden' >

                        <img src={profilePic} alt="profile" className=' ' width="100" height="100" />
                    </div>}

                    <div className='w-full flex justify-center items-center gap-3'>
                        <textarea ref={textareaRef} onFocus={() => setInputIsFocused(true)} value={replyText} onChange={handleReplyInput} className='resize-none h-10 overflow-hidden bg-transparent border-none outline-none text-white w-full pt-2 placeholder:text-[#71767b] text-xl  placeholder:text-xl' placeholder='Post your reply' />

                        <div className='w-full mt-3 flex justify-end'>
                            <div className={`rounded-full  items-end w-max    ${replyText.length > 0 ? "bg-white" : "bg-[#787a7a]"}  text-[#000000] px-4 py-1`}>
                                <button className='font-bold'>Reply</button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className="  border-b border-twitterBorder mt-4  ">

            </div>

        </div>
    )
}

export default TweetReply
