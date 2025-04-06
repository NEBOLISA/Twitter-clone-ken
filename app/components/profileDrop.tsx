import React, { CSSProperties, useState } from 'react'
import { FileDrop } from 'react-file-drop'

import BeatLoader from 'react-spinners/BeatLoader'
import { IoIosCamera } from "react-icons/io";
import { UploadCoverChangeEvent, UploadCoverEvent } from './profileComponent';
import { UserInfo } from '../store/useUserStore';
// import { UserInfo } from '../hooks/useUserInfo';


interface ProfileDropProps{
    isUserProfile: boolean,
    onChange:(files: FileList | null, e: UploadCoverEvent | UploadCoverChangeEvent,type?:string)=> Promise<void>,
    errorMsg:string,
    profile:UserInfo
    handleFileSelect?:(e: React.ChangeEvent<HTMLInputElement>)=>void
    isImageUploading:boolean
    type:string
}
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};
const ProfileDrop = ({isUserProfile,type, onChange,handleFileSelect,errorMsg,profile,isImageUploading}:ProfileDropProps) => {
     const [frameEnter, setFrameEnter] = useState(false)
        const [isFileOver, setIsFileOver] = useState(false)
  return (
 
 <FileDrop
    onDrop={onChange}
    onDragOver={() => { isUserProfile && setIsFileOver(true); setFrameEnter(false) }}
    onDragLeave={() => isUserProfile && setIsFileOver(false)}
    onFrameDragEnter={() => isUserProfile && setFrameEnter(true)}
    onFrameDragLeave={() => isUserProfile && setFrameEnter(false)}
    onFrameDrop={()=>{isUserProfile && setFrameEnter(false); setIsFileOver(false)}}
>
    <div className={` ${frameEnter ? "bg-gray-100" : isFileOver ? "bg-gray-300/90" : "bg-twitterBorder/30"} h-40 relative  `}>

        <input onChange={handleFileSelect} className='hidden' type="file" name="" id="cam" />
        {isUserProfile && <label htmlFor="cam" className={` absolute  -top-6 right-2 cursor-pointer bg-white rounded-full`}>
            <IoIosCamera color='black' className='w-8 h-8' />

        </label>
        }
        {errorMsg ? <p className='text-lg text-red-400'>{errorMsg}</p> : isImageUploading ?
            (<div className='flex w-full h-full items-center justify-center '>
                <BeatLoader
                    size={13}
                    cssOverride={override}
                    color="white"
                    style={{ color: "white", display: "block" }}
                    aria-label="Loading Spinner"
                    data-testid="loader" />
            </div>)
            : (profile?.cover && 
                <>
                   <div className={` ${frameEnter ? "bg-gray-100" : isFileOver ? "bg-gray-300/30" : ""} h-40 absolute inset-0 flex  ${!isImageUploading && 'bg-transparent'}  `}></div>
                  {  <img src={profile?.[type]} alt="img-cover" className={`${type == "cover" ? " w-full h-full object-cover opacity-100": " rounded-full w-full" } z-20 object-cover w-full h-full `} /> }
                </>
             
            )


         
        }

    </div>
</FileDrop>
    
   
  )
}

export default ProfileDrop
