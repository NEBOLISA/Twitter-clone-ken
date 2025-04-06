

import User from "@/lib/models/User";
import { initMongoose } from "@/lib/mongoose";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import Post from "@/lib/models/Post";
import Like from "@/lib/models/Like";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import Retweet from "@/lib/models/Retweet";
import Follow from "@/lib/models/Follow";
import { authOptions } from "@/lib/auth";
interface UpdatedPostType {
    _id: string;
    liked: boolean;
    retweeted: boolean;
    following:boolean;
    [key: string]: any;
}


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
        const currentUserId = searchParams.get("currentUserId")
        const author = searchParams.get("author")
        const userId = session.user.id
        const postId = searchParams.get("postId");
       
        if(currentUserId){
            const Posts =  await Post.find({author:currentUserId,parent:{$exists:true}}).populate('author').populate({
                path: "parent",
                populate: {
                  path: "author",  
                },
              }).sort({ createdAt: -1 }).exec()
             
              const userRetweets = await Retweet.find({ userId })
            const userLikes = await Like.find({ userId })
            const userFollowers = await Follow.find({ followerId: userId })
            const userFollowingSet = new Set(userFollowers.map((follow) => follow.followingId.toString()))
            const likedPostsSet = new Set(userLikes.map((like) => like.postId.toString()))
            const retweetedPostsSet = new Set(userRetweets.map((retweet) => retweet.postId.toString()))
            const updatedPosts = Posts.map((post: UpdatedPostType) => ({
                ...post.toObject(),
                
                liked: likedPostsSet.has(post._id.toString()),
                retweeted: retweetedPostsSet.has(post._id.toString()),
                following: userFollowingSet.has(post.author._id.toString()),
                parent: post.parent
                ? {
                    ...post.parent.toObject(),
                    liked: likedPostsSet.has(post.parent._id.toString()),
                    retweeted: retweetedPostsSet.has(post.parent._id.toString()),
                    following: post.parent.author
                        ? userFollowingSet.has(post.parent.author._id.toString())
                        : false,
                  }
                : null,
            }));
            return NextResponse.json({ Posts:updatedPosts }, { status: 200 })
        }
        if (!id) {
           
            let searchFilter;
             if(postId || author){
               postId ?  searchFilter = {parent:postId} :searchFilter = {author, parent: { $exists: false }}
             }else{
                const userFollowers = await Follow.find({followerId:userId})
                const idsIFollow = userFollowers.map(f=> f.followingId)
                searchFilter = {author:{$in:[...idsIFollow, userId]}, parent: { $exists: false } }
             }
            
            const Posts =  await Post.find(searchFilter).populate('author').sort({ createdAt: -1 }).exec()
       
            const userRetweets = await Retweet.find({ userId })
            const userLikes = await Like.find({ userId })
            const userFollowers = await Follow.find({ followerId: userId })
            const userFollowingSet = new Set(userFollowers.map((follow) => follow.followingId.toString()))
            const likedPostsSet = new Set(userLikes.map((like) => like.postId.toString()))
            const retweetedPostsSet = new Set(userRetweets.map((retweet) => retweet.postId.toString()))
            const updatedPosts = Posts.map((post: UpdatedPostType) => ({
                ...post.toObject(),
                liked: likedPostsSet.has(post._id.toString()),
                retweeted: retweetedPostsSet.has(post._id.toString()),
                following: userFollowingSet.has(post.author._id.toString())
            }));
            
            return NextResponse.json({ Posts: updatedPosts }, { status: 200 })
           
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
        const { post, senderId, parent,images } = await request.json();
        
        const newPost = await Post.create({ post, author: senderId, parent,images });
        
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

