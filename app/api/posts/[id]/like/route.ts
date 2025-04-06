import User from "@/lib/models/User";
import { initMongoose } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Post from "@/lib/models/Post";
import Like from "@/lib/models/Like";

export async function GET(request: NextRequest) {
    try {
        await initMongoose()
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId")
       
            const post = await Like.find({userId})
            
            return NextResponse.json({ post });
    


    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    }
}




export async function POST(request: NextRequest,{ params }: { params: Promise<{ id: string }> }, ) {
    try {
        await initMongoose()
        const { id } = await params
        //const id =  params.id
        const postId = id

        const { userId } = await request.json();
       

        const likeExists = await Like.findOne({ postId:id, userId });
        if (likeExists) {
            // if(likeExists.likes === 0){
            //     return NextResponse.json({ success: false, message: `You have unliked  this post` }, { status: 200 });
            // }
            // await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
            return NextResponse.json({ success: false, message: `You have unliked  this post` }, { status: 200 });
        }
        await Like.create({ postId:id, userId });
        await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
        return NextResponse.json({ success: true, message: `Like successful`, data:{userId,postId} }, { status: 200 });
    } catch (error) {
        const err = error as any;
        return NextResponse.json({ success: false, message: `An error occured`, error: err.message }, { status: 500 });
    }

}
