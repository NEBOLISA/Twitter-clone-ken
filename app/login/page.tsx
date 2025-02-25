'use client';

import { useState, useEffect } from 'react';
import { getProviders, ClientSafeProvider, useSession } from 'next-auth/react';
import SignInButton from '../components/button';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
   
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    fetchProviders();
  }, []);
  const router = useRouter()
  const {data,status} = useSession()
  useEffect(() => {
   
    if (status === "authenticated") {
      router.push(`/`);
    }
  }, [status, router]);
   if(status === "loading"){
    return ''
   }
  

  return (
    <div className="flex justify-center items-center h-screen">
      {providers &&
        Object?.values(providers).map((provider) => (
          <div key={provider?.id}>
            <SignInButton provider={provider} />
          </div>
        ))}
    </div>
  );
};

export default LoginPage;


// import { getProviders, ClientSafeProvider, useSession } from 'next-auth/react';

// import React from 'react'
// import SignInButton from '../components/button';



// // interface LoginPageProps {
// //   providers: Record<string, AppProvider>
// // }

// const  LoginPage = async () => {
//   const providers = await getProviders();
// //   const {data,status} = useSession()
  
//   return (
//     <div className='flex justify-center items-center h-screen' >
//      {providers && Object.values(providers).map((provider: ClientSafeProvider) => (
//       <div key={provider.id}>
//         <SignInButton provider={provider} />
       
//       </div>
//      ))}
//     </div>
//   )
// }

// export default LoginPage;

