import React from 'react'

import { ReactNode } from 'react';


const PublicLayout = ({ children }: { children: ReactNode }) => {
  
    return (
        <div className=' flex min-h-screen w-screen justify-center items-center  '>
            
                {children}
            
        </div>
    )
}

export default PublicLayout
