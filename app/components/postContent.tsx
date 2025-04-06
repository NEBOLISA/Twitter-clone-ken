import React, { useEffect } from 'react'

import { HiDotsHorizontal } from "react-icons/hi";

import ReactTimeAgo from 'react-time-ago';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import PostActionBtns from './postActionBtns';
import TweetActionsMenu from './tweetActionsMenu';
import { useAppContext } from '../contexts/AppContext';
import { postsType } from '../(auth)/page';
//import { format } from "timeago.js";
import { format as timeAgo } from "timeago.js";







interface PostContentProps {
    post?: postsType;
    isOptionsOpen?: boolean;

    postDetail?: boolean
    isViewPostOptionsOpen?: string
    setOpenOptionMenu?: React.Dispatch<React.SetStateAction<string>>
    setIsOptionsOpen?: React.Dispatch<React.SetStateAction<boolean>>
    setIsViewPostOptionsOpen?: React.Dispatch<React.SetStateAction<string>>
    getPosts?: () => Promise<void>;
    onLike?: () => void
    openOptionMenu?: string
    reply?: boolean


}
const PostContent = ({ post, reply, onLike, openOptionMenu, setOpenOptionMenu, isOptionsOpen, setIsViewPostOptionsOpen, postDetail, isViewPostOptionsOpen }: PostContentProps) => {
    const router = useRouter();
    const { menuRef, buttonRef } = useAppContext();

    const date = new Date(post?.createdAt ?? Date.now());

    const timeFormatted = format(date, "hh:mm a");
    const dateFormatted = format(date, "MMM d, yyyy");
    const postDate = new Date(post?.createdAt ?? Date.now());
    const now = new Date();
    const timeDifference = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/${post?.author?.userName}`)

    }


    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            if (postDetail) {
                setIsViewPostOptionsOpen!("")
            } else { setOpenOptionMenu!("") }
        }
    };
    const NavigateToDetails = () => {
        router.push(`/${post?.author?.userName}/status/${post?._id}`)
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleOptionsClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (postDetail) {
            setIsViewPostOptionsOpen!(post?._id!)

        } else {
            setOpenOptionMenu!(post?._id!)

        }



    }

    return (
        <>
            {!postDetail && (post ? (
                <Link href={`/${post?.author?.userName}/status/${post?._id}`} className=' cursor-pointer  flex gap-2 relative '>
                    {reply && <div className='h-14  border-l-2 border-[#333639] absolute left-5 top-11'></div>}
                    {openOptionMenu == post?._id && <TweetActionsMenu menuRef={menuRef} />}
                    {/* <Link href={`/${post?.author?.userName}`}   ></Link> */}
                    <div className='z-40'>
                        <div onClick={handleImageClick} className='rounded-full w-10 h-10 overflow-hidden' >

                            <img src={post?.author?.image} alt="" width="100" height="100" />
                        </div>
                    </div>


                    <div className='grow w-max h-max'>
                        <div className='flex  justify-between'>
                            <div className='flex md:items-center items-start md:gap-1 gap-0 md:flex-row flex-col'>
                                {/* <Link href={`/${post?.author?.userName}`}>   </Link> */}
                                <div onClick={handleImageClick} className='font-bold '>{post?.author?.name}</div>


                                <div className={`flex items-center gap-1 -mt-[6px] mb-1 md:mt-0 md:mb-0`}>
                                    {/* <Link href={`/${post?.author?.userName}`}>   </Link> */}
                                    <h3 onClick={handleImageClick} className='text-md text-[#71767b] 
                                font-medium'>{`@${post?.author?.userName} `}</h3>


                                    <div className='flex gap-1  items-center '>
                                        <div className=' text-md text-[#71767b] font-medium'>.</div>
                                        {post?.createdAt && <p className='text-sm text-[#71767b] font-medium'>{timeDifference < 24 ? timeAgo(postDate) : format(postDate, "MMM d")}</p>}
                                    </div>
                                </div>
                            </div>
                            <div onClick={handleOptionsClick} ref={buttonRef} className='group   w-8 h-8 rounded-full  flex justify-center items-center  '>
                                <button className='flex   items-center justify-center group-hover:bg-[#1c233780] group-hover:w-8 group-hover:h-8  rounded-full'>

                                    <HiDotsHorizontal className='cursor-pointer text-twiterLightGray group-hover:text-[#1d9bf0]' />
                                </button>
                            </div>

                        </div>
                        <p className='-mt-1 text-sm capitalize font-medium'>{post?.post}</p>
                        {post?.images && post?.images.length > 0 && (<div className='w-full h-[200px]   my-2 sm:h-[300px] lg:h-[400px] overflow-x-auto  gap-2'>
                            <div className={` rounded-xl overflow-hidden grid gap-1 
                                    ${post?.images.length === 1 ? 
                                        "grid-cols-1"
                                       : post.images.length === 2
                                         ? "grid-cols-2"
                                    : "grid-cols-2 grid-rows-2"
                                    }   w-full h-full`}>
                                {(post?.images.map((img, i) => (
                                    <div key={i} className={` overflow-hidden w-full
                                        ${post?.images && post.images.length > 2 && i === 0 ? "row-span-2" : ""}`}>
                                    <img key={i} className='w-full h-full  object-cover' src={img} alt={"imagePost"} />
                                    </div>
                                )))}
                            </div>
                        </div>)
                        }
                        {post && <PostActionBtns openOptionMenu={openOptionMenu!} onLike={onLike} singlePost post={post} />}
                    </div>

                </Link>) : <div className='w-full h-screen text-white flex items-center justify-center'>Loading...</div>)}
            {postDetail &&
                <div className='relative'>
                    {isViewPostOptionsOpen == post?._id && <TweetActionsMenu menuRef={menuRef} />}
                    <div className='flex gap-2 '>
                        <div onClick={handleImageClick} className='z-40' >
                            <div className='rounded-full w-10 h-10 overflow-hidden' >

                                <img src={post?.author?.image} alt="" />
                            </div>
                        </div>
                        <div className='grow'>
                            <div className='flex  justify-between  md:gap-1 gap-0 md:flex-row flex-col'>
                                <Link href={`/${post?.author?.userName}`}>
                                    <div className='cursor-pointer' onClick={handleImageClick}>
                                        <div className='font-bold '>{post?.author?.name}</div>


                                        <h3 className='text-md -mt-1 text-[#71767b] font-medium'>{`@${post?.author?.userName} `}</h3>
                                    </div>
                                </Link>
                                <div onClick={handleOptionsClick} ref={buttonRef} className='group   w-8 h-8 rounded-full  flex justify-center items-center  '>
                                    <button className='flex   items-center justify-center group-hover:bg-[#1c233780] group-hover:w-8 group-hover:h-8  rounded-full'>

                                        <HiDotsHorizontal className='cursor-pointer text-twiterLightGray group-hover:text-[#1d9bf0]' />
                                    </button>
                                </div>

                            </div>

                        </div>

                    </div>
                    <p className='mt-3 text-sm capitalize font-medium'>{post?.post}</p>
                    {post?.images && post?.images.length > 0 && (<div className='w-full h-[200px]   my-2 sm:h-[300px] lg:h-[400px] overflow-x-auto  gap-2'>
                            <div className={`grid gap-1 
                                    ${post?.images.length === 1 ? 
                                        "grid-cols-1"
                                       : post.images.length === 2
                                         ? "grid-cols-2"
                                    : "grid-cols-2 grid-rows-2"
                                    }   w-full h-full`}>
                                {(post?.images.map((img, i) => (
                                    <div key={i} className={`rounded-lg overflow-hidden w-full
                                        ${post?.images && post.images.length > 2 && i === 0 ? "row-span-2" : ""}`}>
                                    <img key={i} className='w-full h-full rounded-xl object-cover' src={img} alt={"imagePost"} />
                                    </div>
                                )))}
                            </div>
                        </div>)
                        }
                    <div className='flex  gap-2 mt-3'>
                        <h3 className='text-md -mt-1 flex text-[#71767b] font-medium'>{timeFormatted}  <div className='' >.</div></h3>

                        <h3 className='text-md -mt-1 text-[#71767b] font-medium'>{dateFormatted}<span className=''>.</span></h3>

                    </div>
                    <div>
                        {post && <PostActionBtns openOptionMenu={openOptionMenu!} post={post} />}
                    </div>
                </div>
            }
        </>
    )
}

export default PostContent
