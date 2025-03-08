import React, { use, useEffect, useRef, useState } from 'react'
import { UserInfo } from '../hooks/useUserInfo'
import MediaComponent from './mediaComponent'
import { useAppContext } from '../contexts/AppContext'
import { MdCancel } from "react-icons/md";
import EmojiPicker from '../components/emojiPicker'
import InputEmoji from "react-input-emoji";
import { set } from 'mongoose';
import { usePostContext } from '../contexts/PostContext';

interface PostTweetProps {
  user: UserInfo | null
  onPost: () => void
}

const PostTweet = ({ user, onPost }: { user: UserInfo, onPost: () => void }) => {
  
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [postStatusMsg, setPostStatusMsg] = useState<string>('')
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false)
  const [isSuccessMessage, setIsSuccessMessage] = useState<boolean>(false)
  const [postFocus, setPostFocus] = useState<boolean>(false)
  const { file, preview, emojiRef, setPreview, setFile,  post,setPost,  } = useAppContext()
  const {emojiBoxOpen, chosenEmoji,setChosenEmoji, setEmojiBoxOpen}=usePostContext()



  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true)

    await fetch('/api/posts', {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        post,
        senderId: user?._id
      })
    }).then(response => {

      if (response.status === 200) {
        setIsLoading(false)
        response?.json()?.then(json => {
          setPostStatusMsg(json.message)
          setIsSuccessMessage(true)
          setPost("")
          if (onPost) {
            onPost()
          }
          setTimeout(() => {
            setIsSuccessMessage(false)
          }, 3000)

        })
      } else if (response.status === 500) {
        response.json().then(json => setPostStatusMsg(json.error))
        setIsErrorMessage(true)
      }
    })

  }
  const handleCancel = () => {
    setPreview("")
    setFile(null)
  }
  const handleClickOutside = (event: MouseEvent) => {
   
          if (
              emojiRef.current &&
              //@ts-ignore
              !emojiRef.current.contains(event.target as Node) 
             
          
          ) {
             
              setEmojiBoxOpen!(false)
          }
      };
  
  
      useEffect(() => {
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
              document.removeEventListener("mousedown", handleClickOutside);
          };
      }, []);
      
   
const handleOnChange =(e:React.ChangeEvent<HTMLTextAreaElement>)=>{

 
  
    setPost(e.target.value);
 
}
  return (
    <form className='mx-5' onSubmit={handleSubmitPost}>
      <div className='flex'>
        <div className=''>
          <div className='rounded-full w-10 overflow-hidden '>

            <img src={user?.image} alt="profile_img" />
          </div>
        </div>
        <div className='grow pl-2 '>
          <textarea onFocus={() => setPostFocus(true)} onChange={(e)=>{handleOnChange(e)}} value={post} className={`w-full  ${!postFocus ? "h-8" : ""}  p-2 bg-transparent overflow-hidden resize-none text-twitterWhite outline-none`} placeholder={`What's happening?!`} />
          {preview && <div className="mt-2 relative">
            <MdCancel onClick={handleCancel} className='absolute w-9 h-9  text-[#787a7a] cursor-pointer top-2 right-2 z-30' />

            {file?.type.startsWith("image/") ? (
              <img src={preview} alt="Preview" className="max-w-full  w-full h-full rounded-lg" />
            ) : (
              <video src={preview} controls className="max-w-full h-full w-full rounded-lg" />
            )}

          </div>}
          {
        emojiBoxOpen && 
        <div className='w-max' >
         <EmojiPicker  emojiRef={emojiRef} isMainPage/>
        </div>
        
          }
          {postFocus && <div className='border-b border-twitterBorder h-3 mt-3'></div>}
          <div className=' flex justify-between text-right   pt-2'>
            <MediaComponent isMainPage/>
            <button disabled={!post.length} className={` ${post.length > 0 ? "bg-twitterBlue text-white" : "cursor-default  bg-[#707070]"} mb-2 text-black px-5 py-[0.4rem] rounded-full font-bold`}>{isLoading ? "Loading..." : "Post"}</button>
            
          </div>
          {isSuccessMessage && <p className='text-green-400 font-semibold text-center'>{postStatusMsg}</p>}
        </div>
      </div>
    </form>
  )
}

export default PostTweet
