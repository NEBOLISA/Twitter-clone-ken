
// import User from "@/lib/models/User";
// import { initMongoose } from "@/lib/mongoose";
// import { getServerSession, unstable_getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";
// import { authOptions } from "../auth/[...nextauth]/route";
// import Follow from "@/lib/models/Follow";



// export async function POST(request: Request) {
//     await initMongoose()
//     try {
//       const session = await getServerSession(authOptions)
//       const { followingId } = await request.json();
//       const followerId = session.user.id;
//             // Get the authenticated user
          
//             if (!session) {
//                 return NextResponse.json(
//                     { message: "Unauthorized. Please log in." },
//                     { status: 401 }
//                 );
//             }
    
           
    
//             // Ensure IDs are provided
//             if (!followerId || !followingId) {
//                 return NextResponse.json(
//                     { message: "Follower and Following IDs are required." },
//                     { status: 400 }
//                 );
//             }
    
//             // Prevent users from following themselves
//             if (followerId === followingId) {
//                 return NextResponse.json(
//                     { message: "You cannot follow yourself." },
//                     { status: 400 }
//                 );
//             }
    
//             // Check if the follow relationship already exists
//             const existingFollow = await Follow.findOneAndDelete({ followerId, followingId });
//             if (!existingFollow) {
//                 return NextResponse.json(
//                     { message: "You are not following this user." },
//                     { status: 400 }
//                 );
//             }
    
      
     
//       return NextResponse.json({ existingFollow, message: `UnFollowed successfully ` }, { status: 201 });
//     } catch (error) {
//       return NextResponse.json({message: `error UnFollowing profile, try again` },{ status: 500 });
//     }
// }

