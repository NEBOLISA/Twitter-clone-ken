import React, { useEffect, useState, CSSProperties, useMemo } from 'react'
import BackArrowNav from './backArrowNav'

import axios from 'axios'
import PostContent from './postContent'
import { postsType } from '../(auth)/page'
import { FileDrop } from 'react-file-drop'
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../firebaseConfig'
import { ToastContainer, toast } from "react-toastify";
import ProfileDrop from './profileDrop'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// import useUserInfo, { UserInfo } from '../hooks/useUserInfo'
import { UserInfo, useUserStore } from '../store/useUserStore'
import BeatLoader from 'react-spinners/BeatLoader'
import RepliesComponent from './repliesComponent'

export const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};
interface ProfilePropType {
    moveBack: () => void
    userName: string
    isUserProfile: boolean
}
export interface UploadCoverEvent extends React.DragEvent<HTMLDivElement> { }
export interface UploadCoverChangeEvent extends React.ChangeEvent<HTMLInputElement> { }

const ProfileComponent = ({ moveBack, userName, isUserProfile }: ProfilePropType) => {
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
    const [userPosts, setUserPosts] = useState<postsType[]>()

    const [imageUrl, setImageUrl] = useState("")
    const [isCoverUploading, setIsCoverUploading] = useState(false)
    const [isProfileUploading, setIsProfileUploading] = useState(false)
    const { userInfo, userProfile, setUserProfile } = useUserStore();
    const [isPostLoading, setIsPostLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
   const [isFollowing, setIsFollowing] = useState(false)
    const [isFollowHover, setIsFollowHover] = useState<boolean| undefined>(false)
    const [followErrorMessage, setFollowErrorMessage] = useState("")
    const [profileReplies, setProfileReplies] = useState<postsType[]>()
    const router = useRouter()


    const getUser = async () => {
        setIsPostLoading(true)
        const response = await axios.get(`/api/users?userName=${userName}`);
      
        if (!isUserProfile) {
            setProfile(response.data?.user)
            
           
        } else {
            
            setUserProfile(response.data?.user)
        }



    }
async function getUserReplies(profileId:string){

        const response = await axios.get(`/api/posts?currentUserId=${profileId }`)
        //console.log(response?.data)
        setProfileReplies(response?.data?.Posts)

    }

    useEffect(() => {
        getUser()


    }, [userName])
    const profileId = useMemo(() => profile?._id, [profile]);
    const userProfileId = useMemo(() => userProfile?._id, [userProfile]);
    useEffect(() => {
        setIsFollowing(profile?.isFollowing);
    
        if (!profileId) {
            return;
        }
    
        const fetchPosts = async () => {
            try {
                setIsPostLoading(true);
                const response = await axios.get(`/api/posts?author=${profileId}`);
                setPosts(response.data.Posts);
            } catch (error) {
                console.error(error);
            } finally {
                setIsPostLoading(false);
            }
        };
    
        fetchPosts();
        getUserReplies(profile?._id!)
    }, [profile]);
    
    useEffect(() => {
        if (!userProfileId) {
            return;
        }
    
        const fetchUserPosts = async () => {
            try {
                setIsPostLoading(true);
                const response = await axios.get(`/api/posts?author=${userProfileId}`);
                setUserPosts(response.data.Posts);
            } catch (error) {
                console.error(error);
            } finally {
                setIsPostLoading(false);
            }
        };
    
        fetchUserPosts();
        getUserReplies(userProfile?._id!)
    }, [userProfile]);
    


    const UploadCover = (type: string) => async (files: FileList | null, e: UploadCoverEvent | UploadCoverChangeEvent) => {

        e.preventDefault()
        if (!userProfile) {
            return
        }
        try {
            if (userProfile?.cover && type === "cover") {
                setIsCoverUploading(true)
                const deleteCover = await deleteFile(userProfile.cover);

            } else if (userProfile?.image && type === "image") {
                setIsProfileUploading(true)
                const deleteCover = await deleteFile(userProfile.image);
            }

        } catch (error) {
            console.log(error)
        }
        const file = files && files[0];
        if (!file) return;
        try {
            type === "cover" ? setIsCoverUploading(true) : setIsProfileUploading(true)
            const storageRef = ref(storage, `uploads/${file.name}`);
            await uploadBytes(storageRef, file);

            const downloadURL = await getDownloadURL(storageRef);
            setImageUrl(downloadURL);
            axios.post('/api/uploads', { imageUrl: downloadURL, type }).then((response) => {
                toast.success(`${type === "cover" ? "Cover" : "Profile Image"} Upload Successful!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false, // Shows progress bar
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setImageUrl(response?.data?.user?.cover)
                type === "cover"
                    ? setUserProfile((prev) =>
                        prev ? { ...prev, cover: response?.data?.user?.cover } : null
                    )

                    : setUserProfile((prev) => prev ? { ...prev, image: response?.data?.user?.image } : null)
            })

        } catch (error) {
            type === "cover" ? setIsCoverUploading(false) : setIsProfileUploading(false)
            setTimeout(() => {
                setErrorMsg("")
            }, 3000)
            setErrorMsg((error as any).message)
        } finally {
            type === "cover" ? setIsCoverUploading(false) : setIsProfileUploading(false)
        }


    }


    const handleProfileEdit = () => {
        router.push("/settings/profile")
        //     localStorage.setItem("post",JSON.stringify(post ))

        //    setPostToReply(post!);
        // }
    }

    const deleteFile = async (fileUrl: string) => {
        try {
            const storagePath = decodeURIComponent(fileUrl.split("/o/")[1].split("?")[0]);
            const fileRef = ref(storage, storagePath);

            await deleteObject(fileRef);
            console.log("File deleted successfully!");
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const type = "cover"
        const files = (e.target as HTMLInputElement).files;
        UploadCover(type)(files, e)
    }

    async function handleFollow(){
       
        // if(!isFollowing){
            setIsFollowing(!isFollowing)
        try {
            
            const res = await axios.post("/api/follow", {followingId: profile?._id})
            if (res.status < 200 || res.status >= 300) {
               
                const errorData = res.data;
                throw new Error(errorData.message);
              }
       
        } catch (error:any) {
            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false, // Shows progress bar
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setFollowErrorMessage(error.message)
        }
    // }
    // else{
    //     setIsFollowing(!isFollowing)
    //     try {
            
    //         const res = await axios.post("/api/unfollow", {followingId: profile?._id})
    //         if (res.status < 200 || res.status >= 300) {
               
    //             const errorData = res.data;
    //             throw new Error(errorData.message);
    //           }
       
    //     } catch (error:any) {
    //         toast.error(error.message, {
    //             position: "top-right",
    //             autoClose: 3000,
    //             hideProgressBar: false, // Shows progress bar
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //         setFollowErrorMessage(error.message)
    //     }
    // }
    }

    return (
        <div>
            <ToastContainer />
            {isUserProfile ?<BackArrowNav postsCount={userProfile?.postsCount} moveBack={moveBack} title={userName} profile /> : <BackArrowNav postsCount={profile?.postsCount} moveBack={moveBack} title={userName} profile />}
            <div className='relative'>
                {isUserProfile ? <ProfileDrop type="cover" isUserProfile={isUserProfile} onChange={UploadCover("cover")} handleFileSelect={handleFileSelect} errorMsg={errorMsg} profile={userProfile!} isImageUploading={isCoverUploading} /> : <ProfileDrop type="cover" isUserProfile={isUserProfile} onChange={UploadCover("cover")} handleFileSelect={handleFileSelect} errorMsg={errorMsg} profile={profile!} isImageUploading={isCoverUploading} />}
                <div className='flex justify-between w-full relative'>

                    <div>

                    </div>
                    <div className=' flex items-center  border-twitterDarkGray w-32 h-32 overflow-hidden border-4 rounded-full  absolute left-3 -bottom-4'>
                        {isUserProfile ? (!!userProfile && userProfile?.image.length !== 0) && <ProfileDrop type="image" isUserProfile={isUserProfile} onChange={UploadCover("image")} errorMsg={errorMsg} profile={userProfile!} isImageUploading={isProfileUploading} /> : (!!profile && profile?.image.length !== 0) && <ProfileDrop type="image" isUserProfile={isUserProfile} onChange={UploadCover("image")} errorMsg={errorMsg} profile={profile!} isImageUploading={isProfileUploading} />}
                        {/*  */}
                    </div>
                    <div className='mt-2 mr-3'>
                        {!isUserProfile && (profile && <button onMouseOver={()=>setIsFollowHover(true)} onMouseOut={()=>setIsFollowHover(false)}  className={`${isFollowing? "border hover:border-red-600 hover:text-red-600 border-[#536471] bg-transparent text-white":" bg-white text-black  hover:bg-white/90 "} px-4 py-[5px] rounded-full font-semibold`} onClick={handleFollow}>{isFollowing? (isFollowHover ? "UnFollow":"Following"):"Follow"}</button>)}
                        {isUserProfile && <div onClick={() => handleProfileEdit()} className='px-4 ml-3 py-[5px] border border-[#536471] cursor-pointer hover:bg-white/15 rounded-full bg-transparent text-white font-semibold'>Edit profile</div>}
                    </div>
                </div>
               { (isUserProfile ?( userProfile?._id) :  (profile?._id))  && <div className='pl-3 mt-4'>
                    <div >
                        <h1 className='font-bold text-xl'>{isUserProfile ? userProfile?.name : profile?.name}</h1>
                        <h2 className='text-sm text-twiterLightGray'>@{isUserProfile ? userProfile?.userName : profile?.userName}</h2>
                    </div>
                    <p className='text-white font-medium text-base'>{isUserProfile ? userProfile?.bio : profile?.bio}</p>
                    <div className='flex gap-2 mt-3'>
                        <h3 className='text-md -mt-1 text-[#71767b] font-medium'>{
                            isUserProfile ? 
                                <> 
                                    {userProfile && 
                                    <> 
                                        <p className='text-white inline'>{userProfile?.followersCount}</p>
                                        {`${userProfile?.followersCount <=1 ? " Follower" : " Followers"}`} 
                                    </>
                                    }
                                </>
                                        : 
                                <>
                                    { profile && 
                                     <> 
                                        <p className='text-white inline'>{profile?.followersCount}</p> 
                                        {`${profile?.followersCount <=1 ? " Follower" : " Followers"}`}
                                     </>
                                    }
                                </>
                             } 
                        </h3>
                        <h3 className='text-md -mt-1 text-[#71767b] font-medium'>{
                            isUserProfile 
                                ? (userProfile && <p className='text-white inline' >{userProfile?.followingCount} Following
                                </p>) 
                                : (profile && <p className='text-white inline' >{profile?.followingCount} Following</p>)
                            } 
                        </h3>
                    </div>
                </div>}
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
                {selectedNav === "Posts" && (isPostLoading 
                     ? 
                            <div className='w-full h-[50vh]  flex items-center justify-center'><BeatLoader
                                size={15}
                                cssOverride={override}
                                color="#1d9bf0"
                                style={{ color: "#1d9bf0", display: "block" }}
                                aria-label="Loading Spinner"
                                data-testid="loader" /> 
                            </div> 

                     : 
                            (isUserProfile 
                                ? 
                                  userPosts?.map((post) => (
                                        <div className='mt-2' key={post?._id}>
                                            <div className='px-3 '>
                                                <PostContent isOptionsOpen={isOptionsOpen} post={post} setIsOptionsOpen={setIsOptionsOpen} openOptionMenu={openOptionMenu} setOpenOptionMenu={setOpenOptionMenu} />
                                            
                                            
                                            
                                            </div>

                                            <div className="  border-b border-twitterBorder mt-2  "></div>


                                        </div>
                                  )) 
                                : 
                                   posts?.map((post) => (
                                    <div className='mt-2 ' key={post?._id}>
                                        <div className={`px-3 `}>
                                            <PostContent isOptionsOpen={isOptionsOpen} post={post} setIsOptionsOpen={setIsOptionsOpen} openOptionMenu={openOptionMenu} setOpenOptionMenu={setOpenOptionMenu} />
                                        </div>

                                        <div className="  border-b border-twitterBorder mt-2  "></div>


                                    </div>
                                ))
                            ))
                }
                {
                    selectedNav === "Replies" && <div className=''><RepliesComponent Customkey={selectedNav} replies={profileReplies!}/></div>
                }
                {
                    selectedNav === "Media" && <div className='px-3'>Media</div>
                }
            </div>


        </div>
    )
}

export default ProfileComponent
