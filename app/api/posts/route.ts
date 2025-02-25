

import User from "@/lib/models/User";
import { initMongoose } from "@/lib/mongoose";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Post from "@/lib/models/Post";
import Like from "@/lib/models/Like";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export async function GET(request: Request) {
    try {
        await initMongoose()
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id")
        const userId = searchParams.get("userId");
       
        if (!id) {
            const Posts = await Post.find().populate('author').sort({ createdAt: -1 }).exec()
            //  const postsLikedByMe = await Like.find({
            //     userId,
            //     postId:Posts.map(post=>post?._id)
            //  })
            // const idsLikedByMe = postsLikedByMe.map((post)=>post.postId)
            return NextResponse.json({ Posts}, { status: 200 })
        }
        if (id) {

            const post = await Post.findById(id).populate('author').exec()

            return NextResponse.json({ post });
        }


    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    }
}




export async function POST(request: Request) {
    try {
        await initMongoose()
        const { post, senderId } = await request.json();

        const newPost = await Post.create({ post, author: senderId });
        return NextResponse.json({ success: true, message: `Post made successfully`, post: newPost }, { status: 200 });
    } catch (error) {
        const err = error as any;
        return NextResponse.json({ success: false, message: `An error occured`, error: err.message }, { status: 500 });
    }

}
export async function PUT(request: Request) {
    try {
        await initMongoose();
        
       
        const { updatedCollection } = await request.json();

     
        if (!Array.isArray(updatedCollection)) {
            return NextResponse.json(
                { success: false, message: "Invalid data format. Expected an array." },
                { status: 400 }
            );
        }

        const bulkOps = updatedCollection.map(post => ({
            
            updateMany: {
                filter: { _id: post._id }, 

                update: { $set: {...post} },  
            },
            
        }));
            
        const result = await Post.bulkWrite(bulkOps);

        return NextResponse.json(
            { success: true, message: "Collection updated successfully", result },
            { status: 200 }
        );
    } catch (error) {
        const err = error as any;
        return NextResponse.json(
            { success: false, message: "An error occurred", error: err.message },
            { status: 500 }
        );
    }
}

