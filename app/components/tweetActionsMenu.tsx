import React from 'react'
interface TweetActionsMenuProps {
  menuRef: React.RefObject<HTMLDivElement | null>
}
const TweetActionsMenu = ({menuRef}:TweetActionsMenuProps) => {
  return (
    <div ref={menuRef} onClick={(e)=>{e.preventDefault();e.stopPropagation()}} className='absolute right-3 bg-black  shadow-[rgba(255,255,255,0.2)_0px_0px_15px,rgba(255,255,255,0.18)_0px_0px_3px_1px] h-[400px] p-3 rounded-lg w-[300px] z-50  top-2 cursor-default'>
      TweetActionsMenu
    </div>
  )
}

export default TweetActionsMenu
