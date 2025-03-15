

import User from "@/lib/models/User";
import { initMongoose } from "@/lib/mongoose";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  await initMongoose()
 const {searchParams} = new URL(request.url);
 const id = searchParams.get("id")
 const userName = searchParams.get("userName")
//  if(!id){
 
//   return NextResponse.json({error:"id required"}, {status:400})
//  }
const user = id ? await User?.findById(id):await User?.findOne({userName})
 return NextResponse.json({ user});
}

export async function PUT(request: Request) {
const session = await getServerSession(authOptions)
if (!session || !session.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
  const { userName } = await request.json();
 const updatedUser = await User.findByIdAndUpdate(session.user.id, {userName},{new:true})
  return NextResponse.json({ message: "User updated", user: updatedUser });
}


export async function POST(request: Request) {

    return NextResponse.json({ message: `User  created successfully` });
}
