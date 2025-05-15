const Listing = require("../models/listing");




module.exports.index = async (req,res)=>{
    const alllist = await Listing.find({});
    res.render("listings/index.ejs",{alllist});

}

module.exports.renderNewForm = (req,res)=>{
    
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate: {
            path: "author"
        }})
    .populate("owner");
    if (!list) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
}

module.exports.createListing = async (req,res, next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{list});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);

}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted a listing");
    res.redirect("/listings");
}