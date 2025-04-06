import React, { use, useEffect, useRef, useState } from 'react'

import MediaComponent from './mediaComponent'
import { useAppContext } from '../contexts/AppContext'
import { MdCancel } from "react-icons/md";
import EmojiPicker from '../components/emojiPicker'
import InputEmoji from "react-input-emoji";
import { set } from 'mongoose';
import { usePostContext } from '../contexts/PostContext';
import { UserInfo } from '../store/useUserStore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { override, UploadCoverChangeEvent, UploadCoverEvent } from './profileComponent';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import BeatLoader from 'react-spinners/BeatLoader';
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";

// import { UserInfo } from '../hooks/useUserInfo';


interface PostTweetProps {
  user: UserInfo | null
  onPost?: () => void
  modal?:boolean
}

const PostTweet = ({ user, onPost,modal }: { user: UserInfo, onPost?: () => void,modal?:boolean }) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [postStatusMsg, setPostStatusMsg] = useState<string>('')
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false)
  const [isSuccessMessage, setIsSuccessMessage] = useState<boolean>(false)
  const [postFocus, setPostFocus] = useState<boolean>(false)
  const { file, preview, emojiRef, setPreview, setFile, post, setPost, } = useAppContext()
  const { emojiBoxOpen, chosenEmoji, setChosenEmoji, setEmojiBoxOpen } = usePostContext()
  const [errorMsg, setErrorMsg] = useState({
    message:""
  })
  const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
  // const [downloadURL, setDownloadUrl] = useState<string[]>([])

  
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
        setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0);
        setCanScrollRight(
           ( scrollContainerRef.current.scrollLeft + scrollContainerRef.current.clientWidth) + 1 <
            scrollContainerRef.current.scrollWidth
        );
        console.log( scrollContainerRef.current.scrollWidth,"scrollwidth"
        )
        console.log( scrollContainerRef.current.scrollLeft,"scrollleft"
        )
        console.log( scrollContainerRef.current.clientWidth,"clientWidth"
        )
    }
};

useEffect(() => {
    updateScrollButtons();
    scrollContainerRef.current?.addEventListener("scroll", updateScrollButtons);
    return () => scrollContainerRef.current?.removeEventListener("scroll", updateScrollButtons);
}, [preview]);
const scroll = (direction:number) => {
  if (scrollContainerRef.current) {
      const scrollAmount = 200; // Adjust scrolling distance
      scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  }
};
  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true)
    let downloadURL: string[] | null = null;

  
  if (file && file.length > 0) {
     const result = await UploadPostImages(file); 
     downloadURL = result ?? null
  }
  const postData: Record<string, any> = {
    post,
    senderId: user?._id,
  };

 
  if (downloadURL) {
    postData.images = downloadURL;
  }
    if(file && file.length > 0) await UploadPostImages(file)
    
    await fetch('/api/posts', {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(postData),
    }).then(response => {

      if (response.status === 200) {
        setIsLoading(false)
        response?.json()?.then(json => {
          setPostStatusMsg(json.message)
          setIsSuccessMessage(true)
          setPost("")
          setPreview([])
          setFile([])
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
        setPreview([])
          setFile([])
      }
    })

  }

  const UploadPostImages = async (files: File[]) => {

    if (!files) return;
    try {
    
      const storageRef = await Promise.all(files.map(async (file) => {
        const storageRef = ref(storage, `uploads/${file.name}`)
        await uploadBytes(storageRef, file);
        return storageRef
      }))


      const downloadURL = await Promise.all(storageRef.map(async (ref) => {
        return await getDownloadURL(ref);
      }))
      return downloadURL
    } catch (error:any) {
     
      setTimeout(() => {
        setErrorMsg({message:""})
      }, 3000)
      setErrorMsg((prev)=> ({...prev, message:error.message}))
  }
  }




  const handleCancel = (file: File, index: number) => {
    setPreview((prev) => prev ? [...prev.slice(0, index)] : [])
    setFile((prev) => prev ? [...prev.slice(0, index)] : [])
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


  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {



    setPost(e.target.value);

  }

  return (
    <form className={`${modal ? "mx-0":"mx-5" }`} onSubmit={handleSubmitPost}>
      <div className={`${modal ? "flex items-centeer gap-4 w-full":"flex"} `}>
        <div className=''>
          <div className='rounded-full w-10 h-10 overflow-hidden '>

            {user && <img src={user?.image} alt="profile_img" />}
          </div>
        </div>
        <div className={`grow ${modal? "" :"pl-2"} w-[80%]`}>
          <textarea onFocus={() => setPostFocus(true)} onChange={(e) => { handleOnChange(e) }} value={post} className={`w-full  ${!postFocus ? "h-8" : ""}  ${modal ? "p-0":"p-2"} bg-transparent overflow-hidden resize-none text-twitterWhite outline-none`} placeholder={`${modal?"Post your reply":"What's happening?!"}`} />
          {preview && <div  className="mt-2 relative">
            {canScrollLeft  && <div className=' p-2 rounded-full bg-[#232323] absolute cursor-pointer top-[50%] left-2 z-30'>
              <FaArrowLeft className='w-4 h-4 text-white' onClick={() => scroll(-1)} />
             </div>}
             {canScrollRight && <div className=' p-2 rounded-full bg-[#232323] absolute cursor-pointer top-[50%] right-2 z-30'>
              <FaArrowRight className='w-4 h-4 text-white' onClick={() => scroll(1)}/>
             </div>}
            <div ref={scrollContainerRef} className={` w-full sm:h-full  h-[200px] overflow-x-auto flex gap-2 relative`}>
            
           

              {file?.map((f, index) => (
                <React.Fragment key={index * 2  }>
                  {
                    preview[index] && (
                      <div key={index} className={`${preview.length <= 1 ? "w-full h-full" : "lg:w-1/2  h-[400px]"}  flex-shrink-0 relative`}>



                        <MdCancel onClick={() => handleCancel(f, index)} className='absolute w-9 h-9  text-[#787a7a] cursor-pointer top-2 right-2 z-30' />
                        {f.type.startsWith("image/") ? (
                          <img
                            src={preview[index]} // Correct preview
                            alt={`Preview ${index}`}
                            className="max-w-full w-full sm:h-full h-[200px] object-fill rounded-lg"
                          />
                        ) : (
                          <video
                            src={preview[index]}
                            controls
                            className="max-w-full w-full h-auto rounded-lg"
                          />
                        )}
                      </div>)

                  }
                </React.Fragment>
              ))}
            </div>


            {/* {file?.map((f, index) => (
              
              <div key={index} className="w-full h-full overflow-x-scroll flex ">

                <div className='w-full h-full '>
                {f.type.startsWith("image/") ? (
                  <>
                 
                  <img
                    src={preview[index]} // Get the corresponding preview
                    alt={`Preview ${index}`}
                    className="max-w-full w-full h-full rounded-lg"
                  />
                  </>
                   
                ) : (
                  <video
                    src={preview[index]} // Get the corresponding preview
                    controls
                    className="max-w-full h-full w-full rounded-lg"
                  />
                )}
                </div>
                
              </div>
            ))} */}


          </div>}
          {
            emojiBoxOpen &&
            <div className='w-max' >
              <EmojiPicker emojiRef={emojiRef} isMainPage />
            </div>

          }
          {postFocus && <div className='border-b border-twitterBorder h-3 mt-3'></div>}
          <div className=' flex justify-between text-right   pt-2'>
            <MediaComponent isMainPage />
            <button disabled={!post.length} className={` ${post.length > 0 ? "bg-twitterBlue text-white" : "cursor-default  bg-[#707070]"} mb-2 text-black px-5 py-[0.4rem] rounded-full font-bold`}>{isLoading ? (<div className='w-full   flex items-center justify-center'><BeatLoader
                                size={13}
                                cssOverride={override}
                                color="white"
                                style={{ color: "white", display: "block" }}
                                aria-label="Loading Spinner"
                                data-testid="loader" /> 
                            </div> ) : "Post"}</button>

          </div>
          {isSuccessMessage && <p className='text-green-400 font-semibold text-center'>{postStatusMsg}</p>}
        </div>
      </div>
    </form>
  )
}

export default PostTweet
