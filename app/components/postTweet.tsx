import React, { useState } from 'react'
import { UserInfo } from '../hooks/useUserInfo'
interface PostTweetProps {
  user: UserInfo | null
  onPost: () => void
}

const PostTweet = ({user,onPost}:{user:UserInfo,onPost:()=>void}) => {
const [post, setPost] = useState<string>("")
const [isLoading,setIsLoading] = useState<boolean>(false)
const [postStatusMsg,setPostStatusMsg]=useState<string>('')
const [isErrorMessage,setIsErrorMessage] = useState<boolean>(false)
const [isSuccessMessage,setIsSuccessMessage] = useState<boolean>(false)
const handleSubmitPost = async (e:React.FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault();
  setIsLoading(true)
  
  await fetch('/api/posts',{
    method:"POST",
    headers:{'content-type':'application/json'},
    body:JSON.stringify({
        post,
        senderId:user?._id
    })
   }) .then(response => {
    
    if(response.status === 200){
        setIsLoading(false)
        response?.json()?.then(json => {
         setPostStatusMsg(json.message)
         setIsSuccessMessage(true)
         setPost("")
       if(onPost){
        onPost()
       }
         setTimeout(()=>{
           setIsSuccessMessage(false)
         },3000)
        
        })
    }else if(response.status === 500){
        response.json().then(json => setPostStatusMsg(json.error))
        setIsErrorMessage(true)
    }
})

}
  return (
    <form className='mx-5' onSubmit={handleSubmitPost}>
      <div className='flex'>
        <div className=''>
            <div className='rounded-full w-10 overflow-hidden '>

            <img src={user?.image} alt="profile_img"  />
            </div>
        </div>
        <div className='grow pl-2 '>
        <textarea onChange={(e)=>{setPost(e.target.value)}} value={post}className='w-full   p-2 bg-transparent resize-none text-twitterWhite outline-none' placeholder={`What's happening?!`}/>
        <div className='border-b border-twitterBorder h-3 mt-3'></div>
        <div className='text-right   pt-2'>

        <button disabled={!post.length} className={` ${post.length >0 ? "bg-twitterBlue text-white":"cursor-default  bg-[#707070]"} mb-2 text-black px-5 py-[0.4rem] rounded-full font-bold`}>{isLoading ? "Loading..." : "Post"}</button>
        {isSuccessMessage && <p className='text-green-400 font-semibold text-center'>{postStatusMsg}</p>}
        </div>
        </div>
      </div>
    </form>
  )
}

export default PostTweet
