import mongoose, { model, models, Schema } from "mongoose";

const LikesSchema = new Schema({
   userId:String,
   postId:String
},{timestamps:true})

const Like = models?.Like || model('Like',LikesSchema)

export default Like