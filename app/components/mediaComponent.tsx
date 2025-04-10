import React, { useState } from 'react'
import { LuImage } from "react-icons/lu";

import { MdOutlineGifBox } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import { useAppContext } from '../contexts/AppContext';
import { usePostContext } from '../contexts/PostContext';


const MediaComponent = ({isMainPage,isReplyPage}:{isMainPage?:boolean,isReplyPage?:boolean}) => {
    const { setPreview,preview, setFile,replyFile,setReplyFile, replyPreview, setReplyPreview,  } = useAppContext()
    const {setEmojiBoxOpen, emojiBoxOpen,replyEmojiBoxOpen, setReplyEmojiBoxOpen}=usePostContext()


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        
        if (selectedFiles.length > 0) {
            const filePreviews = selectedFiles.map(file => URL.createObjectURL(file));
    
            if (isMainPage) {
                setFile((prev)=>([...(prev||[]), ...selectedFiles]));
                setPreview((prev)=>([...(prev || []), ...filePreviews]));
                console.log({preview})
            } else if (isReplyPage) {
                setReplyFile(selectedFiles);
                setReplyPreview(filePreviews);
            }
        }
    };
    
    
    const handleEmoji = () => {
        isMainPage ?
        setEmojiBoxOpen(!emojiBoxOpen): setReplyEmojiBoxOpen(!replyEmojiBoxOpen)
       
    }


    return (
        <div className='flex items-center gap-4'>
            <label htmlFor="image">
                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    id='image'
                    className="hidden "
                />
                <LuImage className='text-[#1d9bf0] w-5 h-5 cursor-pointer' />
            </label>

            <MdOutlineGifBox className='text-[#1d9bf0] w-5 h-5 cursor-pointer' />
            
            <BsEmojiSmile  onClick={handleEmoji} className='text-[#1d9bf0] w-5 h-5 cursor-pointer emoji-button' />
           
            
        </div>
    )
}

export default MediaComponent
