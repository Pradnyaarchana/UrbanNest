const Listing = require("../models/listing");




module.exports.index = async (req, res) => {
    const { category, q } = req.query;
    let filter = {};
    if (category) {
        filter.categories = category;
    }
    if (q) {
        // Case-insensitive search in title, location, or country
        filter.$or = [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ];
    }
    const alllist = await Listing.find(filter);
    res.render("listings/index.ejs", { alllist, category });
};

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
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    
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

    let originalImage = list.image.url;
    originalImage = originalImage.replace('/upload', '/upload/h_300,w_250')
    res.render("listings/edit.ejs",{list, originalImage});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== 'undefined'){ 
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);

}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted a listing");
    res.redirect("/listings");
}