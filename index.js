import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import card_api from './routes/card_api.js';
import sign_up from './routes/sign_up.js';
import user_api from './routes/user_api.js';
import confirm from './routes/confirm.js';

import {isAuthorize} from './middlewares/auth.js'
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit: "50mb"}))
app.use('/api/v1/card', card_api);
app.use('/api/v1/login', sign_up);
app.use('/api/v1/confirm', confirm);

app.use(isAuthorize)
app.use('/api/v1/user', user_api);


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