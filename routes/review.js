const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Reviews = require("../models/reviews.js");

const {validatereview} = require("../middleware.js");


router.post("/", validatereview, wrapAsync(async (req, res) => {
    console.log("Request Body:", req.body); // Logs submitted data
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    // console.log("Found Listing:", listing); // Logs the listing data
    const newReview = new Reviews(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
        req.flash("success", "Created a new review");
    res.redirect(`/listings/${req.params.id}`);
}));

router.delete("/:reviewid", 
    wrapAsync(async(req,res)=>{
        let {id, reviewid}= req.params;
        await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewid}});
        await Reviews.findByIdAndDelete(reviewid);
        req.flash("success", "Deleted a new review");
        res.redirect(`/listings/${id}`);
    })
)

module.exports = router;