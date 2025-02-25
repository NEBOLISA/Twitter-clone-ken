import React from 'react'
import { AiOutlineRetweet } from "react-icons/ai";
import { LuPenLine } from "react-icons/lu";
import { PostStateProps } from './postActionBtns';


interface RetweetMenuProps {
    onclick:React.MouseEventHandler<HTMLDivElement>
    singlePost?:boolean
    menuRef:React.RefObject<HTMLDivElement | null>
    postState?:PostStateProps
    handleUndoneRetweet:React.MouseEventHandler<HTMLDivElement>
}
const RetweetMenu = ({onclick,singlePost,menuRef,postState,handleUndoneRetweet}:RetweetMenuProps) => {
    return (
        <div  ref={menuRef} className ={` z-30 absolute bg-black  shadow-[rgba(255,255,255,0.2)_0px_0px_15px,rgba(255,255,255,0.18)_0px_0px_3px_1px]  p-3 rounded-lg w-max h-max top-2 ${singlePost ? "left-9":"left-20"} flex flex-col gap-5`}>
            <div className='flex items-center gap-3 cursor-pointer' >
                <AiOutlineRetweet className="w-5 h-5" />
               { postState?.retweeted ?  <h3 className='font-bold text-[16px] ' onClick={handleUndoneRetweet} >Undo Repost</h3>:
              
               <h3 className='font-bold text-[16px] ' onClick={onclick}>Repost</h3>
               }
            </div>
            <div className='flex items-center gap-3'>
                <LuPenLine className="w-5 h-5"/>
                <h3 className='font-bold text-[16px]'>Quote</h3>
            </div>
            {singlePost && <div className='flex items-center gap-3'>
                <AiOutlineRetweet className="w-5 h-5"/>
                <h3 className='font-bold text-[16px]'>View Quotes</h3>
            </div>}
        </div>
    )
}

export default RetweetMenu
