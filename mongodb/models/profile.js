import mongoose from "mongoose";
const Profile = new mongoose.Schema({
    points: {type: Number, required: false, default: 0}
})
const ProfileSchema = mongoose.model("Profile", Profile);
export default ProfileSchema;