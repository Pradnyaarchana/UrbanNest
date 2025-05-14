const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title: {
        type:String,
        required: true
    },
    description: String,
    image: {
        type:String,
        default:"https://www.istockphoto.com/stock-photos/nature-and-landscapes",
        set: (v) => 
        v === "" 
            ? "https://www.istockphoto.com/stock-photos/nature-and-landscapes"
            : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type : Schema.Types.ObjectId,
            ref: "reviews",
        },
    ],

    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);


module.exports = Listing;