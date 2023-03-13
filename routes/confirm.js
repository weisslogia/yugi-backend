import express from 'express';
import User from '../mongodb/models/user.js'

const router = express.Router();

router.route('/email/:id').get(async(req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id})
        await user.updateOne({verify_email: true})
        res.status(200).json({success: true, data: "email verify correctly"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error})
    }
})


export default router;
