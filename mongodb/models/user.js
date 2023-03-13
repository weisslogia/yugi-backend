import mongoose from "mongoose";
const User = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    verify_email: {type: String, required: false, default: false},
    phone_number: {type: String, required: false},
    verify_phone_number: {type: String, required: false, default: false},
    password: {type: String, required: true},
    role: {type: String, required: true, default: 'duelist'},
    profile_picture: {type: String, required: false},
    profile: {type:mongoose.Types.ObjectId}
})
const UserSchema = mongoose.model("User", User);
export default UserSchema;