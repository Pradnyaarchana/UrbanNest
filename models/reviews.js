// one to many relationship between losting and reviews
const { string } = require("joi");
const mongoose = require("mongoose");
const { type } = require("../schema");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment : String,
    rating :{
        type: Number,
        min:1,
        max:5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author : {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})
module.exports = mongoose.model("reviews", reviewSchema);