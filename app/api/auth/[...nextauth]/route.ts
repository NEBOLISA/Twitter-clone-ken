import client from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

import GoogleProvider from "next-auth/providers/google";



 const authOptions = {
  // Configure one or more authentication providers
 adapter: MongoDBAdapter(client),
  session:{
    strategy: 'jwt' as 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

  ],
  callbacks: {
    async jwt({ token, account }:{token:JWT,account?:any}) {
      try {
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token; // Return the original token even if there's an error
      }
    },
    async session({ session, token }:{session:any,token:JWT}) {
      try {
        if(session?.user && token?.sub){
        session.accessToken = token.accessToken;
        session.user.id = token.sub;
      }
      return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session; // Return the original session even if there's an error
      }
    },
  }
  
};



const handler = NextAuth( authOptions);


export const GET = handler;
export const POST = handler;
