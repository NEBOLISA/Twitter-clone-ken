import React, { useState } from 'react'
import Picker, { EmojiClickData } from "emoji-picker-react";

import { useAppContext } from '../contexts/AppContext';
import { usePostContext } from '../contexts/PostContext';

const   EmojiPicker = ({emojiRef, replyEmojiRef,isMainPage,isReplyPage}:{emojiRef?:any,replyEmojiRef?:any,isMainPage?:boolean,isReplyPage?:boolean }) => {
   const {setPost, } = useAppContext()
   const {setReplyText,setChosenEmoji} = usePostContext()
   
    
        const onEmojiClick = (emojiData: EmojiClickData) => {
          if(isMainPage){
            setPost((prev) => prev + emojiData.emoji); 
            setChosenEmoji(null);
          }else if(isReplyPage){
           setReplyText((prev) => prev + emojiData.emoji);
           setChosenEmoji(null);
          }
         
        };
    
  return (

    <div ref={isMainPage?emojiRef:replyEmojiRef}>
     <Picker className='picker' style={{backgroundColor:"black"}}   onEmojiClick={onEmojiClick} />
    </div>
                    
 


  )
}

export default EmojiPicker
