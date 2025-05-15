const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //save redirected url to session
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
   
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/listings/${id}`);
    } 
    
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}   


module.exports.validatelisting = (req,res,next) =>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}

module.exports.validatereview = (req,res,next) =>{
    let {error} =  reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewid } = req.params;
    const listing = await Review.findById(reviewid);
   
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    } 
    
    next();
};