import mongoose, { model, models, Schema } from "mongoose";

const RetweetSchema = new Schema({
    post:{type:mongoose.Types.ObjectId, ref:"Post"},
    postId:String,
    userId:String
},{timestamps:true})

const Retweet = models?.Retweet || model('Retweet',RetweetSchema)

export default Retweet