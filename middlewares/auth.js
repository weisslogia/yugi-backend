import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';


dotenv.config();

export const isAuthorize = (req, res, next) => {
    try {
        const decode = jwt.verify(req.headers.authorization.split('Bearer ')[1], process.env.JSONWEBTOKEN_KEY)
        req['user_info'] = decode.user
        next() 
    } catch (err) {
        res.sendStatus(401)
    }
}