import mongoose, { model, models, Schema } from "mongoose";

const FollowsSchema = new Schema({
   followerId:String,
   followingId:String
},{timestamps:true})

const Follow = models?.Follow || model('Follow',FollowsSchema)

export default Follow