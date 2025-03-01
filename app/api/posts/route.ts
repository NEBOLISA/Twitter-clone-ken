

import User from "@/lib/models/User";
import { initMongoose } from "@/lib/mongoose";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Post from "@/lib/models/Post";
import Like from "@/lib/models/Like";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import Retweet from "@/lib/models/Retweet";
interface UpdatedPostType {
    _id: string;
    liked: boolean;
    retweeted: boolean;
    [key: string]: any;
}
export async function GET(request: Request) {
    try {
        await initMongoose()
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id")
        const userId = searchParams.get("userId");
       
        if (!id) {
            const Posts = await Post.find().populate('author').sort({ createdAt: -1 }).exec()
            const userRetweets = await Retweet.find({userId})
            const userLikes = await Like.find({userId})
               const likedPostsSet =  new Set (userLikes.map((like)=> like.postId.toString()))
               const retweetedPostsSet =  new Set (userRetweets.map((retweet)=> retweet.postId.toString()))
            

            const updatedPosts = Posts.map((post:UpdatedPostType) => ({
                ...post.toObject(),
                liked: likedPostsSet.has(post._id.toString()),
                retweeted: retweetedPostsSet.has(post._id.toString())
            }));  
            return NextResponse.json({ Posts:updatedPosts}, { status: 200 })
        }
        if (id) {

            const post = await Post.findById(id).populate('author').exec()
           
            return NextResponse.json({ post }, { status: 200 });
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

