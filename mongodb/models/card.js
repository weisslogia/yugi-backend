import mongoose from "mongoose";
const Card = new mongoose.Schema({
    id: {type: Number, required: false},
    name: {type: String, required: false},
    type: {type: String, required: false},
    frameType: {type: String, required: false},
    desc: {type: String, required: false},
    atk: {type: Number, required: false},
    def: {type: Number, required: false},
    level: {type: Number, required: false},
    race: {type: String, required: false},
    attribute: {type: String, required: false},
    archetype: {type: String, required: false},
    card_sets: {type: [{
        set_name: String,
        set_code: String,
        set_rarity: String,
        set_price: String
    }], required: false},
    card_images: {type: [{
        id: Number,
        image_url: String,
        image_url_small: String,
        image_url_cropped: String,

    }], required: false},
    card_prices: {type: [{
        cardmarket_price: String,
        tcgplayer_price: String,
        ebay_price: String,
        amazon_price: String,
        coolstuffinc_price: String,

    }], required: false},
})
const CardSchema = mongoose.model("Card", Card);
export default CardSchema;