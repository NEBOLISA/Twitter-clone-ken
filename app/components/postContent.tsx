import React, { useEffect } from 'react'
import { postsType } from '../page'
import { HiDotsHorizontal } from "react-icons/hi";

import ReactTimeAgo from 'react-time-ago';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import PostActionBtns from './postActionBtns';
import TweetActionsMenu from './tweetActionsMenu';
import { useAppContext } from '../contexts/AppContext';








interface PostContentProps {
    post?: postsType;
    isOptionsOpen?: boolean;

    postDetail?: boolean
    isViewPostOptionsOpen?: boolean
    setOpenOptionMenu?: React.Dispatch<React.SetStateAction<string>>
    setIsOptionsOpen?: React.Dispatch<React.SetStateAction<boolean>>
    setIsViewPostOptionsOpen?: React.Dispatch<React.SetStateAction<boolean>>
    getPosts?: () => Promise<void>;
    onLike?: () => void
    openOptionMenu?: string


}
const PostContent = ({ post, onLike, openOptionMenu, setOpenOptionMenu, isOptionsOpen, setIsViewPostOptionsOpen, postDetail, isViewPostOptionsOpen }: PostContentProps) => {
    const router = useRouter();
    const { menuRef, buttonRef } = useAppContext();

    const date = new Date(post?.createdAt ?? Date.now());

    const timeFormatted = format(date, "hh:mm a");
    const dateFormatted = format(date, "MMM d, yyyy");
    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/profile/${post?.author?.userName}`)

    }
    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            if (postDetail) {
                setIsViewPostOptionsOpen!(false)
            } else { setOpenOptionMenu!("") }
        }
    };


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
            setIsViewPostOptionsOpen!(true)
        } else {
            setOpenOptionMenu!(post?._id!)
           
        }



    }

    return (
        <>
            {!postDetail && <Link href={`/${post?.author?.userName}/status/${post?._id}`} className='flex gap-2 '>
                {openOptionMenu == post?._id && <TweetActionsMenu menuRef={menuRef} />}
                <div onClick={handleImageClick} className='z-40' >
                    <div className='rounded-full w-10 overflow-hidden' >

                        <img src={post?.author?.image} alt="" width="100" height="100" />
                    </div>
                </div>
                <div className='grow'>
                    <div className='flex  justify-between'>
                        <div className='flex items-center gap-1 '>

                            <div className='font-bold '>{post?.author?.name}</div>
                            <div className={`flex items-center gap-1 `}>

                                <h3 className='text-md text-[#71767b] font-medium'>{`@${post?.author?.userName} `}</h3>

                                <div className='flex gap-1  items-center '>
                                    <div className=' text-md text-[#71767b] font-medium'>.</div>
                                    <ReactTimeAgo className='text-sm text-[#71767b] font-medium' date={post?.createdAt!} locale="en-US" timeStyle="twitter" />
                                </div>
                            </div>
                        </div>
                        <div onClick={handleOptionsClick} ref={buttonRef} className='group   w-8 h-8 rounded-full  flex justify-center items-center  '>
                            <button className='flex   items-center justify-center group-hover:bg-[#1c233780] group-hover:w-8 group-hover:h-8  rounded-full'>

                                <HiDotsHorizontal className='cursor-pointer text-twiterLightGray group-hover:text-[#1d9bf0]' />
                            </button>
                        </div>

                    </div>
                    <p className='-mt-1'>{post?.post}</p>
                    {post && <PostActionBtns openOptionMenu={openOptionMenu!} onLike={onLike} singlePost post={post} />}
                </div>

            </Link>}
            {postDetail &&
                <div className='relative'>
                    {isViewPostOptionsOpen == post?._id && <TweetActionsMenu menuRef={menuRef} />}
                    <div className='flex gap-2 '>
                        <div onClick={handleImageClick} className='z-40' >
                            <div className='rounded-full w-10 overflow-hidden' >

                                <img src={post?.author?.image} alt="" />
                            </div>
                        </div>
                        <div className='grow'>
                            <div className='flex  justify-between'>
                                <div>
                                    <div className='font-bold '>{post?.author?.name}</div>


                                    <h3 className='text-md -mt-1 text-[#71767b] font-medium'>{`@${post?.author?.userName} `}</h3>
                                </div>
                                <div onClick={handleOptionsClick} ref={buttonRef} className='group   w-8 h-8 rounded-full  flex justify-center items-center  '>
                                    <button className='flex   items-center justify-center group-hover:bg-[#1c233780] group-hover:w-8 group-hover:h-8  rounded-full'>

                                        <HiDotsHorizontal className='cursor-pointer text-twiterLightGray group-hover:text-[#1d9bf0]' />
                                    </button>
                                </div>

                            </div>

                        </div>

                    </div>
                    <p className='mt-3'>{post?.post}</p>
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
