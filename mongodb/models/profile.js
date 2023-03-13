import mongoose from "mongoose";
const Profile = new mongoose.Schema({
    test: {type: String, required: false, default: 'Esto es una prueba'}
})
const ProfileSchema = mongoose.model("Profile", Profile);
export default ProfileSchema;