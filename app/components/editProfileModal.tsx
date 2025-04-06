"use client";
import { postsType } from "@/app/(auth)/page";
import { usePostContext } from "@/app/contexts/PostContext";
import { useRouter, useSearchParams } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

import BeatLoader from 'react-spinners/BeatLoader'
import { ClassNames } from "@emotion/react";

// import useUserInfo from "../hooks/useUserInfo";
import { useUserStore } from "../store/useUserStore";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};
const EditProfileComponent = () => {
    const router = useRouter();
    const { userInfo, setUserProfile: setProfile } = useUserStore();
    //const { userInfo,profile, } = useUserStore(); 
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMsg] = useState("")
    const [isInputFocus, setIsInputFocus] = useState({
        name: false,
        userName: false,
        bio: false
    })
    const [data, setData] = useState({
        name: userInfo?.name,
        userName: userInfo?.userName,
        bio: userInfo?.bio
    })
    const [dataWordCount, setDataWordCount] = useState({
        name: 0,
        userName: 0,
        bio: 0
    })
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === "name" && value.length > 50) return;
        if (name === "userName" && value.length > 30) return;
        if (name === "bio" && value.length > 160) return;
        setData((prev) => ({ ...prev, [name]: value }))
        setDataWordCount((prev) => ({ ...prev, [name]: value.length }))


    }

    const handleSaveProfile = async (e: React.MouseEvent<HTMLHeadingElement>) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const response = await axios.post("/api/users", {
                ...data,

            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                setIsLoading(false)
                toast.success(`Profile Updated`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false, // Shows progress bar
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
              
                setProfile(response?.data.user)
            });
            //setProfile((prev)=>({...prev,}))

        } catch (error: any) {
            setIsLoading(false)
            setErrorMsg(error?.message)
            setTimeout(() => {
                setErrorMsg("")
            }, 3000)

        }

    }
    return (
        <div className="fixed w-full inset-0 bg-[#5b708366] z-40 flex justify-center items-center">
            <ToastContainer />
            <div className="bg-black px-4 pt-4 pb-1 rounded-3xl lg:w-[60%] lg:h-[60%] sm:w-[80%] sm:h-[65%] w-[95%] h-[65%]  ">

                <div className="w-full">
                    <div className="flex justify-between items-start h-12 ">
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-max p-[5px] cursor-pointer  rounded-full  hover:bg-twiterLightGray/25">
                                <IoCloseSharp onClick={() => router.back()} fontWeight={100} className="w-6 h-6  text-white" />

                            </div>
                            <p className=" sm:text-xl font-bold text-sm">Edit Profile</p>
                        </div>


                        {isLoading ? <h3 onClick={handleSaveProfile} className="text-black rounded-full cursor-pointer hover:bg-twitterWhite/90 sm:px-4 py-1 px-2 mt-1 bg-twitterWhite font-bold sm:text-[15px] text-[10px]"><BeatLoader
                            size={8}
                            cssOverride={override}
                            color="black"
                            style={{ color: "black", display: "block" }}
                            aria-label="Loading Spinner"
                            data-testid="loader" /></h3> : <h3 onClick={handleSaveProfile} className="text-black rounded-full cursor-pointer hover:bg-twitterWhite/90 sm:px-4 py-1 px-2 mt-1 bg-twitterWhite font-bold sm:text-[15px] text-[10px]">Save</h3>}
                    </div>
                    {errorMessage && <p className="w-full text-center text-red-500 text-sm">{errorMessage}</p>}
                    <div className="mt-6 group   rounded-md border border-[#5b5b5b] p-2 w-full focus-within:border-twitterBlue transition-all ease-out duration-400 focus-within:border-2  flex flex-col-reverse focus-within:pt-0">
                        <input onChange={handleDataChange} value={data?.name} onFocus={() => setIsInputFocus((prev) => ({ ...prev, name: true }))} onBlur={() => setIsInputFocus((prev) => ({ ...prev, name: false }))} type="text" name="name" id="" className="w-full  peer bg-transparent outline-none" />
                        <div className="flex  items-center justify-between peer-focus:text-[13px] text-sm text-twiterLightGray ">
                            <p className={`${isInputFocus.name ? "text-twitterBlue" : ""} transition-all duration-400 ease-in-out`}>Name</p>
                            <p className={`${isInputFocus.name ? "visible" : "invisible"}`}>{`${dataWordCount.name}/50`}</p>
                        </div>

                    </div>
                    <div className="mt-6 group   rounded-md border border-[#5b5b5b] p-2 w-full focus-within:border-twitterBlue transition-all ease-out duration-400 focus-within:border-2  flex flex-col-reverse focus-within:pt-0">
                        <input onChange={handleDataChange} value={data.userName} onFocus={() => setIsInputFocus((prev) => ({ ...prev, userName: true }))} onBlur={() => setIsInputFocus((prev) => ({ ...prev, userName: false }))} type="text" name="userName" id="" className="w-full  peer bg-transparent outline-none" />
                        <div className="flex  items-center justify-between peer-focus:text-[13px] text-sm text-twiterLightGray ">
                            <p className={`${isInputFocus.userName ? "text-twitterBlue" : ""} transition-all duration-400 ease-in-out`}>UserName</p>
                            <p className={`${isInputFocus.userName ? "visible" : "invisible"}`}>{`${dataWordCount.userName}/30`}</p>
                        </div>

                    </div>
                    <div className="mt-6 group   rounded-md border border-[#5b5b5b] p-2 w-full focus-within:border-twitterBlue transition-all ease-out duration-400 focus-within:border-2  flex flex-col-reverse focus-within:pt-0">
                        <textarea onChange={handleDataChange} value={data.bio} rows={4} onFocus={() => setIsInputFocus((prev) => ({ ...prev, bio: true }))} onBlur={() => setIsInputFocus((prev) => ({ ...prev, bio: false }))} name="bio" id="" className="w-full  peer bg-transparent outline-none" />
                        <div className="flex  items-center justify-between peer-focus:text-[13px] text-sm text-twiterLightGray ">
                            <p className={`${isInputFocus.bio ? "text-twitterBlue" : ""} transition-all duration-400 ease-in-out`}>Bio</p>
                            <p className={`${isInputFocus.bio ? "visible" : "invisible"}`}>{`${dataWordCount.bio}/160`}</p>
                        </div>

                    </div>

                </div>



            </div>

        </div>
    );
};

export default EditProfileComponent;
{/*   */ }