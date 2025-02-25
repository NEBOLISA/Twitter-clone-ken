import User from "@/lib/models/User";
import { initMongoose } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Post from "@/lib/models/Post";
import Like from "@/lib/models/Like";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
    try {
        await initMongoose()
        // const { searchParams } = new URL(request.url);
        // const postId = searchParams.get("postId")
         const session = await getServerSession(authOptions)
         const userId = session.user.id
   



        const LikeExists = await Like.find({userId}).sort({ createdAt: -1 }).exec()
           if(LikeExists){
            return NextResponse.json({ postLiked:LikeExists}, { status: 200 })
           }else{
            return NextResponse.json({ liked:false}, { status: 200 })
           }
           


    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    }
}



// export async function POST(request: Request,{ params }: { params: { id: string } }) {
//     try {
//         await initMongoose()
       
//         const id = params.id
//         const postId = id

//         const { userId } = await request.json();
       

//         const likeExists = await Like.findOne({ postId:id, userId });
//         if (likeExists) {
          
//             return NextResponse.json({ success: false, message: `You have unliked  this post` }, { status: 200 });
//         }
//         await Like.create({ postId:id, userId });
//         await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
//         return NextResponse.json({ success: true, message: `Like successful`, data:{userId,postId} }, { status: 200 });
//     } catch (error) {
//         const err = error as any;
//         return NextResponse.json({ success: false, message: `An error occured`, error: err.message }, { status: 500 });
//     }

// }
