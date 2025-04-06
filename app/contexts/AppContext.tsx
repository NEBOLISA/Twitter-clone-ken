"use client"
import React, { createContext, useContext, useRef, useState } from "react";

import  { EmojiClickData } from "emoji-picker-react";
import { PostStateProps } from "../components/postActionBtns";
import { postsType } from "../(auth)/page";
type AppContextType = {
  menuRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLDivElement | null>;
  posts: postsType[];
  setPosts: React.Dispatch<React.SetStateAction<postsType[]>>;
  file: File[] | null;
  setFile: React.Dispatch<React.SetStateAction<File[] | null>>;
  preview: string[] | null;
  setPreview: React.Dispatch<React.SetStateAction<string[] | null>>;
  replyFile: File[] | null;
  setReplyFile: React.Dispatch<React.SetStateAction<File[] | null>>;
  replyPreview: string[] | null;
  setReplyPreview: React.Dispatch<React.SetStateAction<string[] | null>>;
  post: string; 
  setPost: React.Dispatch<React.SetStateAction<string>>;
  emojiRef:React.RefObject<HTMLDivElement | null>
  replyEmojiRef:React.RefObject<HTMLDivElement | null>
  postState: PostStateProps;
  setPostState: React.Dispatch<React.SetStateAction<PostStateProps>>;
   
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
 const [posts, setPosts] = useState<postsType[]>([])
 const [file, setFile] = useState<File[] | null>(null);
 const [preview, setPreview] = useState<string[] | null>(null);
 const [replyFile,setReplyFile] = useState<File[] | null>(null);
 const [replyPreview, setReplyPreview] = useState<string[] | null>(null);
  const [post, setPost] = useState<string>("")
   const [postState, setPostState] = useState<PostStateProps>({
          liked:  false,
          likeNum:  0,
          retweeted:  false,
          retweetNum:  0,
          bookmarked: false,
          commentsCount:0
  
      });
  const emojiRef = useRef(null)
  const replyEmojiRef = useRef(null)
  return (
    <AppContext.Provider value={{replyFile,postState, setPostState,replyEmojiRef,setReplyFile, replyPreview, setReplyPreview, emojiRef, menuRef,file,post, setPost,setFile,preview,setPreview, buttonRef,posts,setPosts }}>
      {children}
    </AppContext.Provider>
  );
};



export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
