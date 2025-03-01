"use client"
import React, { createContext, useContext, useRef, useState } from "react";
import { EmojiClickData } from "emoji-picker-react";
import Post from "@/lib/models/Post";
interface PostStateProps {
    liked: boolean;
    likeNum: number;
    retweeted: boolean;
    retweetNum: number;
    bookmarked: boolean;
  }
type PostContextType = {

    replyText: string;
    setReplyText: React.Dispatch<React.SetStateAction<string>>;
    chosenEmoji: EmojiClickData | null
    setChosenEmoji: React.Dispatch<React.SetStateAction<EmojiClickData | null>>;
    emojiBoxOpen: boolean;
    setEmojiBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
    replyEmojiBoxOpen: boolean;
     setReplyEmojiBoxOpen: React.Dispatch<React.SetStateAction<boolean>>;
     postStates: {[key:string]:PostStateProps};
        updatePostState:(postId:string, newState:Partial<PostStateProps>)=>void
};
const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [replyText, setReplyText] = useState<string>("")
    const [chosenEmoji, setChosenEmoji] = useState<EmojiClickData | null>(null);
    const [emojiBoxOpen, setEmojiBoxOpen] = useState(false)
    const [replyEmojiBoxOpen, setReplyEmojiBoxOpen] = useState(false)
    const [postStates, setPostStates] = useState<{[key:string]:PostStateProps}>({})

    const updatePostState = (postId:string, newState:Partial<PostStateProps>) => {
        setPostStates((prev)=>({
            ...prev,
            [postId]:{
                ...prev[postId],
                ...newState}}))
    }
    
    return (
        <PostContext.Provider value={{replyEmojiBoxOpen,postStates,updatePostState, setReplyEmojiBoxOpen, replyText, chosenEmoji, emojiBoxOpen, setEmojiBoxOpen, setChosenEmoji, setReplyText }}>
            {children}
        </PostContext.Provider>
    );
};
export const usePostContext = (): PostContextType => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("useReplyTextContext must be used within an AppProvider");
    }
    return context;
};