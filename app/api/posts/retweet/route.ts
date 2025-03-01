import User from "@/lib/models/User";
import { initMongoose } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Post from "@/lib/models/Post";
import Like from "@/lib/models/Like";
import Retweet from "@/lib/models/Retweet";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function GET(request: Request) {
    try {
        await initMongoose()
        // const { searchParams } = new URL(request.url);
        // const postId = searchParams.get("postId")
         const session = await getServerSession(authOptions)
         const userId = session.user.id
       
        const RetweetExists = await Retweet.find({userId}).populate('post').sort({ createdAt: -1 }).exec()
        const Posts = await Post.find();
        Posts.map((post)=>{
            
        })
           if(RetweetExists){
            return NextResponse.json({ postRetweeted:RetweetExists}, { status: 200 })
           }else{
            return NextResponse.json({ retweeted:false}, { status: 200 })
           }
           


    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    }
}




export async function POST(request: Request) {
    try {
        await initMongoose()
        const { postId, userId } = await request.json();
        const RetweetExists = await Retweet.findOne({ postId, userId });
        if(RetweetExists){
            return NextResponse.json({ success: false, message: `You have already retweeted` }, { status: 200 });
        }
        const retweet = await Retweet.create({ userId , post: postId,postId });
        await Post.findByIdAndUpdate(postId, { $inc: { retweets: 1 } });
        return NextResponse.json({ success: true, message: `Retweet made successfully`, retweet }, { status: 200 });
    } catch (error) {
        const err = error as any;
        return NextResponse.json({ success: false, message: `An error occured`, error: err.message }, { status: 500 });
    }

}

export async function PUT(request: Request) {
    try {
        await initMongoose()
        const { postId, userId } = await request.json();
        const RetweetExists = await Retweet.findOne({ postId, userId });
        const post = await Post.findById(postId);
        if (!RetweetExists) {

            if (post.retweets <= 0) {
                post.retweets = 0;
                await post.save();

            }
            return NextResponse.json({ success: false, message: `You have already retweeted` }, { status: 200 });
        }
       
        await Retweet.findOneAndDelete({ postId, userId });
        await Post.findByIdAndUpdate(postId, { $inc: { retweets: -1 } });
        return NextResponse.json({ success: true, message: `You have successfully undone retweet` }, { status: 200 });
    } catch (error) {
        const err = error as any;
        return NextResponse.json({ success: false, message: `An error occured`, error: err.message }, { status: 500 });
    }

}
