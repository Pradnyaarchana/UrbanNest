const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");

const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })


const listingController = require("../controllers/listing.js");
 
router
     .route("/")
     .get(wrapAsync(listingController.index))//index route
     .post(
          isLoggedIn,
          // validatelisting, 
          upload.single('listing[image]'),
          wrapAsync(listingController.createListing)
     ); //create route


     //new route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
     .route("/:id")
     .get(wrapAsync(listingController.showListing))
     .put(isLoggedIn, 
     isOwner,
     upload.single('listing[image]'),
     validatelisting,
     wrapAsync(listingController.updateListing))
     .delete(isLoggedIn, wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;