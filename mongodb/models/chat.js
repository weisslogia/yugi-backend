import mongoose from "mongoose";
const Chat = new mongoose.Schema({
    message: {type: String, required: true},
    sender: {type: String, required: true},
    date: {type: String, required: true},
})

const ChatSchema = mongoose.model("Chat", Chat);
export default ChatSchema;