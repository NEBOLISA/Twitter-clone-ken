import React, { useEffect, useState, CSSProperties } from 'react'
import BackArrowNav from './backArrowNav'
import useUserInfo, { UserInfo } from '../hooks/useUserInfo'
import axios from 'axios'
import PostContent from './postContent'
import { postsType } from '../(auth)/page'
import { FileDrop } from 'react-file-drop'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseConfig'
import { ToastContainer, toast } from "react-toastify";
import BeatLoader from 'react-spinners/BeatLoader'
import { IoIosCamera } from "react-icons/io";

interface ProfilePropType {
    moveBack: () => void
    userName: string
}
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};
const ProfileComponent = ({ moveBack, userName }: ProfilePropType) => {
    const navItems = [{
        id: 1,
        title: "Posts"
    }, {
        id: 2,
        title: "Replies"
    }, {
        id: 3,
        title: "Media"
    }]
    const [selectedNav, setSelectedNav] = useState("Posts")
    const [profile, setProfile] = useState<UserInfo>()
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)
    const [openOptionMenu, setOpenOptionMenu] = useState("")
    const [posts, setPosts] = useState<postsType[]>()
    const [frameEnter, setFrameEnter] = useState(false)
    const [isFileOver, setIsFileOver] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [isImageUploading, setIsImageUploading] = useState(false)
    const { userInfo } = useUserInfo()
    const [errorMsg, setErrorMsg] = useState("")
    let isUserProfile = false

    isUserProfile = profile?._id === userInfo?._id

    const getUser = async () => {
        const response = await axios.get(`/api/users?userName=${userName}`)
        setProfile(response.data?.user)


    }


    useEffect(() => {
        getUser()

    }, [userName])

    useEffect(() => {
        if (!profile?._id) {
            return
        }

        axios.get("/api/posts?author=" + profile?._id)
            .then((response) => {
                setPosts(response.data.Posts)
            })
    }, [profile])
    interface UploadCoverEvent extends React.DragEvent<HTMLDivElement> { }
    interface UploadCoverChangeEvent extends React.ChangeEvent<HTMLInputElement> { }

    const UploadCover = async (files: FileList | null, e: UploadCoverEvent | UploadCoverChangeEvent) => {

        e.preventDefault()
        if (!isUserProfile) {
            return
        }
        const file = files && files[0];
        if (!file) return;
        try {
            setIsImageUploading(true)
            const storageRef = ref(storage, `uploads/${file.name}`);
            await uploadBytes(storageRef, file);

            const downloadURL = await getDownloadURL(storageRef);
            setImageUrl(downloadURL);
            axios.post('/api/uploads', { imageUrl: downloadURL }).then((response) => {
                toast.success("Cover Upload Successful!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false, // Shows progress bar
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setImageUrl(response?.data?.user?.cover)
                setProfile((prev) => prev ? { ...prev, cover: response?.data?.user?.cover } : undefined)
            })
        } catch (error) {
            setIsImageUploading(false)
            setTimeout(() => {
                setErrorMsg("")
            }, 3000)
            setErrorMsg((error as any).message)
        } finally {
            setIsImageUploading(false)
        }


    }
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        UploadCover((e.target as HTMLInputElement).files, e)
    }
    return (
        <div>
            <ToastContainer />
            <BackArrowNav moveBack={moveBack} title={userName} profile />
            <div className='relative'>
                <FileDrop
                    onDrop={UploadCover}
                    onDragOver={() => { isUserProfile && setIsFileOver(true); setFrameEnter(false) }}
                    onDragLeave={() => isUserProfile && setIsFileOver(false)}
                    onFrameDragEnter={() => isUserProfile && setFrameEnter(true)}
                    onFrameDragLeave={() => isUserProfile && setFrameEnter(false)}
                >
                    <div className={` ${frameEnter ? "bg-gray-100" : isFileOver ? "bg-gray-300" : "bg-twiterLightGray"} h-40  `}>

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
                            : (profile?.cover && <img src={profile?.cover} alt="img-cover" className='w-full h-full object-cover' />
                            )



                        }

                    </div>
                </FileDrop>
                <div className='flex justify-between w-full relative'>
                    <div>

                    </div>
                    <div className=' border-twitterDarkGray overflow-hidden border-4 rounded-full w-max absolute left-3 -bottom-4'>
                        {(!!profile && profile?.image.length !== 0) && <img src={profile?.image} alt="user-pic" className='w-32 rounded-full' />}
                    </div>
                    <div className='mt-2 mr-3'>
                        <button className='px-4 py-[5px] hover:bg-white/90 rounded-full bg-white text-black font-semibold'>Follow</button>
                    </div>
                </div>
                <div className='pl-3 mt-4'>
                    <div >
                        <h1 className='font-bold text-xl'>{profile?.name}</h1>
                        <h2 className='text-sm text-twiterLightGray'>@{profile?.userName}</h2>
                    </div>
                    <p className='text-white font-medium text-base'>Liquidity Queen 👑 | Web3 Explorer 🚀 | Airdrop Hunter 💰 | TikTok: 23K+ 📈 | Helping You Maximize Airdrops & DeFi Gains ⚡ | Let’s Build, Earn & Learn</p>
                </div>
                <nav className='flex justify-around mt-7 w-full  border-b border-twiterLightGray mb-1 '>

                    {navItems.map((item) => (
                        <div className='hover:bg-twiterLightGray/30 w-full cursor-pointer flex items-center relative justify-center py-4' key={item.id} onClick={() => setSelectedNav(item.title)}>
                            <button className={`${selectedNav === item.title && "font-bold text-white"} text-lg text-twiterLightGray   `}>{item.title}

                            </button>
                            <div className={`${selectedNav === item.title ? "visible opacity-100" : "hidden opacity-0"}  absolute w-14 h-1 bg-[#1d9bf0] rounded-xl bottom-0`}>

                            </div>
                        </div>
                    ))
                    }
                </nav>
                {posts?.map((post) => (
                    <div className='mt-2' key={post?._id}>
                        <div className='px-3'>
                            <PostContent isOptionsOpen={isOptionsOpen} post={post} setIsOptionsOpen={setIsOptionsOpen} openOptionMenu={openOptionMenu} setOpenOptionMenu={setOpenOptionMenu} />
                        </div>

                        <div className="  border-b border-twitterBorder mt-2  "></div>


                    </div>
                ))}
            </div>


        </div>
    )
}

export default ProfileComponent
