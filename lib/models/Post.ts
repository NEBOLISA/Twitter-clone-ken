import mongoose, { model, models, Schema } from "mongoose";

const PostSchema = new Schema({
    author:{type:mongoose.Types.ObjectId, ref:"User"},
    likes:Number,
    retweets:Number,
    post:String,
    commentsCount:{type:Number,default:0},
    parent:{type:mongoose.Types.ObjectId, ref:"Post"},
    images:[String]
    
},{timestamps:true})

const Post = models?.Post || model('Post',PostSchema)

export default Post