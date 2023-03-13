import express from 'express';
import User from '../mongodb/models/user.js'
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const router = express.Router();

router.route('/me').get(async (req, res) => {
    try {
        let me = await User.aggregate([
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'profile',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {$unwind: "$profile"},
            {$match: {_id: mongoose.Types.ObjectId(req['user_info']._id)}}
        ])
        me['password'] = ""
        res.send({ success: true, data: me })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
})
router.route('/').put(async (req, res) => {
    try {
        let me = await User.findOne({ _id: req['user_info']._id })
        const result = await me.updateOne(req.body)
        res.send({ success: true, data: result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
})

export default router