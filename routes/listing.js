const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validatelisting} = require("../middleware.js");



//index route
router.get("/", async (req,res)=>{
    const alllist = await Listing.find({});
    res.render("listings/index.ejs",{alllist});

});

router.get("/new", isLoggedIn, (req,res)=>{
    
    res.render("listings/new.ejs");
});

router.get("/:id", wrapAsync (async (req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id).populate("reviews").populate("owner");
    if (!list) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
}));



router.post("/", validatelisting, wrapAsync (async (req,res, next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");


}));

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{list});
}));

//update route
router.put("/:id", isLoggedIn, isOwner,
     validatelisting,
     wrapAsync(async (req,res)=>{
    let {id} = req.params;
    
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);

}));    

router.delete("/:id", isLoggedIn,  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted a listing");
    res.redirect("/listings");
}));


module.exports = router;