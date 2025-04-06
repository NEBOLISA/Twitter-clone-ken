import User from "@/lib/models/User";
import { initMongoose } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Post from "@/lib/models/Post";
import Like from "@/lib/models/Like";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
       

        const id = params.id
        const postId = id

        const { userId } = await request.json();

        await initMongoose()
        const likeExists = await Like.findOne({ postId: id, userId });
        const post = await Post.findById(postId);
        if (!likeExists) {

            if (post.likes <= 0) {
                post.likes = 0;
                await post.save();

            }
            return NextResponse.json({ success: false, message: `You have unliked  this post` }, { status: 200 });
        }
        await Like.findOneAndDelete({ postId, userId });
        await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
        // await Post.findOneAndUpdate({ _id: postId }, 
        //     { $set: { like: false } }, 
        //     { new: true });
        return NextResponse.json({ success: true, message: `Unlike successful`, data: { userId, postId } }, { status: 200 });
    } catch (error) {
        const err = error as any;
        return NextResponse.json({ success: false, message: `An error occured`, error: err.message }, { status: 500 });
    }

}