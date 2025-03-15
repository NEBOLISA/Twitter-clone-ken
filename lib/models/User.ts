import { model, models, Schema } from "mongoose";

const UserSchema = new Schema({
    name:String,
    email:String,
    image:String,
    userName:String,
    cover:String,
    bio:String
})

const User = models?.User || model('User',UserSchema)

export default User