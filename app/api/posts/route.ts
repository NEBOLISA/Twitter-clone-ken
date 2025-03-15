

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
// const getPosts = async (userId: string) => {
//     const Posts = await Post.find({ parent: null }).populate('author').sort({ createdAt: -1 }).exec()
//     const userRetweets = await Retweet.find({ userId })
//     const userLikes = await Like.find({ userId })
//     const likedPostsSet = new Set(userLikes.map((like) => like.postId.toString()))
//     const retweetedPostsSet = new Set(userRetweets.map((retweet) => retweet.postId.toString()))
//     const updatedPosts = Posts.map((post: UpdatedPostType) => ({
//         ...post.toObject(),
//         liked: likedPostsSet.has(post._id.toString()),
//         retweeted: retweetedPostsSet.has(post._id.toString())
//     }));
//     return NextResponse.json({ Posts: updatedPosts }, { status: 200 })
// }

// const getReplies = async (postId: string) => {
//     const Replies = await Post.find({ parent: postId }).populate('parent')
//     return NextResponse.json({ Posts: Replies }, { status: 200 })
// }
const getSinglePost = async (postId: string,userId:string |null) => {
   
    const post = await Post.findById(postId).populate('author').exec()
    const didUserRetweet = await Retweet.findOne({ postId,userId });
    const didUserLike = await Like.findOne({ postId,userId });

    const updatedPost = {
      ...post.toObject(),
      liked: !!didUserLike, // Convert to boolean
      retweeted: !!didUserRetweet, // Convert to boolean
    };
    return NextResponse.json({ post:updatedPost }, { status: 200 });
}
export async function GET(request: Request) {
    try {
        await initMongoose()
        const session = await getServerSession(authOptions)
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id")
        const userId = session.user.id
        const postId = searchParams.get("postId");
        const author = searchParams.get("author")
      
        if (!id) {
           
            const parent = postId || null;
            const searchItem = author? {author}:{parent}
            const Posts = author? await Post.find( {...searchItem, parent: { $exists: false } }).populate('author').sort({ createdAt: -1 }).exec()
            : await Post.find(searchItem).populate('author').sort({ createdAt: -1 }).exec()
            const userRetweets = await Retweet.find({ userId })
            const userLikes = await Like.find({ userId })
          
            const likedPostsSet = new Set(userLikes.map((like) => like.postId.toString()))
            const retweetedPostsSet = new Set(userRetweets.map((retweet) => retweet.postId.toString()))
            const updatedPosts = Posts.map((post: UpdatedPostType) => ({
                ...post.toObject(),
                liked: likedPostsSet.has(post._id.toString()),
                retweeted: retweetedPostsSet.has(post._id.toString())
            }));
            
            return NextResponse.json({ Posts: updatedPosts }, { status: 200 })
           // return NextResponse.json({ message: "No post found" }, { status: 504 })
        }
        if (id) {
          
           return await getSinglePost(id,userId)
        }


    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    }
}




export async function POST(request: Request) {
    try {
        await initMongoose()
        const { post, senderId, parent } = await request.json();
        
        const newPost = await Post.create({ post, author: senderId, parent });
        if(parent){
            const count = await Post.countDocuments({ parent });
            const ReplyPost = await Post.findById(parent)
             ReplyPost.commentsCount = count
             await ReplyPost.save()
         }
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

                update: { $set: { ...post } },
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

