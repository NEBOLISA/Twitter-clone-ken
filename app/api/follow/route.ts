

import User from "@/lib/models/User";
import { initMongoose } from "@/lib/mongoose";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Follow from "@/lib/models/Follow";

export async function GET(request: Request) {
  await initMongoose()

 return NextResponse.json( "ok");
}

export async function PUT(request: Request) {
// const session = await getServerSession(authOptions)
// if (!session || !session.user) {
//   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// }
//   const { userName } = await request.json();
//  const updatedUser = await User.findByIdAndUpdate(session.user.id, {userName},{new:true})
  return NextResponse.json({ message: "User updated" });
}


export async function POST(request: Request) {
    await initMongoose()
try {
  const session = await getServerSession(authOptions)
  const { followingId } = await request.json();
  const followerId = session.user.id;
        // Get the authenticated user
      
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

       

        // Ensure IDs are provided
        if (!followerId || !followingId) {
            return NextResponse.json(
                { message: "Follower and Following IDs are required." },
                { status: 400 }
            );
        }

        // Prevent users from following themselves
        if (followerId === followingId) {
            return NextResponse.json(
                { message: "You cannot follow yourself." },
                { status: 400 }
            );
        }

        // Check if the follow relationship already exists
        const existingFollow = await Follow.findOne({ followerId, followingId });
        if (existingFollow) {
            await existingFollow.deleteOne();
            return NextResponse.json(
                { message: "Unfollowed Successfully." },
                { status: 400 }
            );
        }

  const follow = await Follow.create({followerId, followingId});
 
  return NextResponse.json({ follow, message: `Followed successfully ` }, { status: 201 });
} catch (error) {
  return NextResponse.json({message: `error Following profile, try again` },{ status: 500 });
}
   
}
