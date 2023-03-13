import express from 'express';
import * as dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';
import axios from 'axios';
import Card from '../mongodb/models/card.js'

dotenv.config();
const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

router.route('/').post(async(req, res) => {
    try {
        let params = ``
        for (const property in req.body) {
            if(params === '') {
                params += `?${property}=${req.body[property]}`
            } else {
                params += `&${property}=${req.body[property]}`
            }
        }
        const result = await axios.get(`${process.env.YUGI_API_URL}/cardinfo.php${params}`)
        const fResult = await filteredResult(result.data.data)
        res.status(200).json({success: true, data: fResult, count: fResult.length})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error})
    }
})

router.route('/random').get(async(req, res) => {
    try {
        const result = await axios.get(`${process.env.YUGI_API_URL}/randomcard.php`)
        const fResult = await filteredResult([result.data])
        res.status(200).json({success: true, data: fResult[0], count: 1})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error})
    }
})

const filteredResult = async (cards) => {
    const filteredResult = [];
    for(let i = 0; i < cards.length; i++) {
        const card = await Card.findOne({id: cards[i].id})
        if(card) {
            filteredResult.push(card)
        } else {
            const images = []
            for(let j = 0; j < cards[i].card_images.length; j++) {
                const photoUrl = await cloudinary.uploader.upload(cards[i].card_images[j].image_url, {unique_filename: false, folder: 'cards'});
                images.push({
                    id: cards[i].id,
                    image_url: photoUrl.url,
                    image_url_small: photoUrl.url,
                    image_url_cropped: photoUrl.url,
                })
            }
            cards[i].card_images = images
            const r = await Card.create(cards[i])
            filteredResult.push(r)
        }
    }
    return filteredResult
}
export default router;
