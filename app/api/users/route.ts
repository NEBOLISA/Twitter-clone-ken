

import User from "@/lib/models/User";
import { initMongoose } from "@/lib/mongoose";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Follow from "@/lib/models/Follow";
import Post from "@/lib/models/Post";

export async function GET(request: Request) {
  await initMongoose()
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")
  const userName = searchParams.get("userName")
  const session = await getServerSession(authOptions)
  //  if(!id){

  //   return NextResponse.json({error:"id required"}, {status:400})
  //  }
  if (!id && !userName) {
    return NextResponse.json({ error: "id or userName required" }, { status: 400 });
  }

  const user = id ? await User?.findById(id) : await User?.findOne({ userName })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const userObject = user.toObject();
  if (userName) {
    const Following = await Follow.findOne({ followerId: session.user.id, followingId: user?._id })
    const followersCount = await Follow.countDocuments({followerId:user._id})
    const followingCount = await Follow.countDocuments({followingId:user._id})
    const postsCount = await Post.countDocuments({author:user?._id})
    userObject.isFollowing = Following === null ? false : true
    userObject.followersCount = followersCount
    userObject.followingCount = followingCount
    userObject.postsCount = postsCount
  }

  return NextResponse.json({ user:userObject });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { userName } = await request.json();
  const updatedUser = await User.findByIdAndUpdate(session.user.id, { userName }, { new: true })
  return NextResponse.json({ message: "User updated", user: updatedUser });
}


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const updatedData: { name: string, userName: string, bio: string } = { name: "", userName: "", bio: "" }
    const { name, userName, bio } = await request.json();
    if (name) updatedData.name = name;
    if (userName) updatedData.userName = userName;
    if (bio) updatedData.bio = bio;


    const user = await User.findByIdAndUpdate(session.user.id, updatedData, { new: true });
    return NextResponse.json({ user, message: `Profile successfully updated` });
  } catch (error) {
    return NextResponse.json({ message: `error updating profile, try again` });
  }

}
