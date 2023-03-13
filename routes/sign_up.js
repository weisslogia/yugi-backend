import express from 'express';
import * as dotenv from 'dotenv';
import User from '../mongodb/models/user.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { CourierClient } from '@trycourier/courier';
import Profile from '../mongodb/models/profile.js';

const salt = bcryptjs.genSaltSync(15);
dotenv.config();
const router = express.Router();


router.route('/sign_up').post(async (req, res) => {
    try {
        let find = await User.findOne({ username: req.body.username })
        if (find) {
            res.send({ success: false, message: "Username already in use" })
            return;
        }
        find = await User.findOne({ email: req.body.email })
        if (find) {
            res.send({ success: false, message: "Email already in use" })
            return;
        } else {
            req.body['password'] = await bcryptjs.hash(req.body['password'], salt)
            const profile = await Profile.create({
                test: 'Hola'
            });
            const user = await User.create({profile: profile._id, ...req.body})

            const courier = CourierClient({ authorizationToken: process.env.COURIER_TOKEN });
            const { requestId } = await courier.send({
                message: {
                    template: process.env.CONFIRM_EMAIL_TEMPLATE_ID,
                    to: {
                        email: user.email,
                    },
                    data: {
                        userName: user.username,
                        email: user.email,
                        verificationLink: generateEmailConfirmUrl(user)
                    },
                    routing: {
                        method: "single",
                        channels: ["email"],
                    },
                },
            });

            user["password"] = ""
            res.send({ success: true, data: "Confirm email" })
            return;
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
})

router.route('/').post(async (req, res) => {
    try {
        let find = await User.findOne({ username: req.body.login_id })
        if (!find) {
            find = await User.findOne({ email: req.body.login_id })
        }
        if (!find) {
            find = await User.findOne({ phone_number: req.body.login_id })
        }
        if (find) {
            const result = await bcryptjs.compare(req.body.password, find.password)
            if (!result) {
                res.status(404).json({ success: false, data: "Password incorrect" })
                return;
            } else {
                find.password = ""
                const token = jwt.sign({ user: find }, process.env.JSONWEBTOKEN_KEY, {
                    noTimestamp: true,
                })
                res.send({ success: true, user: find, token })
                return;
            }
        } else {
            res.status(404).json({ success: false, data: "Authentication id incorrect" })
            return;
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
})


const generateEmailConfirmUrl = (user) => {
    return process.env.SERVER_URL + '/api/v1/confirm/email/'+user._id;
}

export default router;
