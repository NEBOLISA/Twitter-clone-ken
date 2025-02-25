"use client"
import React, { createContext, useContext, useRef, useState } from "react";
import { postsType } from "../page";

type AppContextType = {
  menuRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLDivElement | null>;
  posts: postsType[];
  setPosts: React.Dispatch<React.SetStateAction<postsType[]>>;

};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
 const [posts, setPosts] = useState<postsType[]>([])


  return (
    <AppContext.Provider value={{ menuRef, buttonRef,posts,setPosts }}>
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
