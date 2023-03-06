import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import card_api from './routes/card_api.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit: "50mb"}))
app.use('/api/v1/card', card_api);


app.get('/', async(req, res) => {
    res.send("hello from dall-e")
})

const startServer = async() => {
    try {
        connectDB(process.env.MONGODB_URL)
        app.listen(8080, ()=> console.log("Server has started on http://localhost:8080"))
    } catch(error) {
        console.error(error)        
    }
}

startServer()