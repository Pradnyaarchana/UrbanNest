const Listing = require("../models/listing");
const {isLoggedIn, isOwner, validatelisting} = require("../middleware.js"); 
const Reviews = require("../models/reviews.js");

module.exports.createReview = async (req, res) => {
    console.log("Request Body:", req.body); // Logs submitted data
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    // console.log("Found Listing:", listing); // Logs the listing data
    const newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
        req.flash("success", "Created a new review");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview = async(req,res)=>{
        let {id, reviewid}= req.params;
        await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewid}});
        await Reviews.findByIdAndDelete(reviewid);
        req.flash("success", "Deleted a review");
        res.redirect(`/listings/${id}`);
    }