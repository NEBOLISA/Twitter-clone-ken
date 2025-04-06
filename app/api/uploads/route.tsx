

import User from "@/lib/models/User";
import { initMongoose } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";


export async function POST(request: Request) {

    try {
        const body = await request.json(); // Parse JSON request body
        const { imageUrl,type } = body;
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!imageUrl) {
            return new Response(JSON.stringify({ message: "Image URL is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
          if(type === "cover") 
            {const user = await User.findByIdAndUpdate(session.user.id,{cover:imageUrl},{new:true})
        

        return new Response(JSON.stringify({ message: "Cover saved", user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }else if(type === "image"){
        const user = await User.findByIdAndUpdate(session.user.id,{image:imageUrl},{new:true})
        

        return new Response(JSON.stringify({ message: "Profile saved", user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    } catch (error) {
        return new Response(JSON.stringify({ message: "Server Error", error: (error as any).message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}
