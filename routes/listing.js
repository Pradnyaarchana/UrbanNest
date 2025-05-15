const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");

const listingController = require("../controllers/listing.js");

router
     .route("/")
     .get(wrapAsync(listingController.index))//index route
     .post(validatelisting, wrapAsync(listingController.createListing)); //create route


     //new route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
     .route("/:id")
     .get(wrapAsync(listingController.showListing))
     .put(isLoggedIn, isOwner,
     validatelisting,
     wrapAsync(listingController.updateListing))
     .delete(isLoggedIn, wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;