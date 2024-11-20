const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/urbannest";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err)
    });



async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res)=>{
    res.send("working");
});

// app.get("/testlisting", async (req, res)=>{
//     let listingsample = new Listing({
//         title:"My new Villa",
//         description: "By the beach",
//         price: 2400,
//         location: "Nashik",
//         country: "India"
//     });
//     await listingsample.save();
//     console.log("successful");
//     res.send("Successful");
// })

app.get("/listings", async (req,res)=>{
    const alllist = await Listing.find({});
    res.render("listings/index.ejs",{alllist});

});

app.post("/listings", async (req,res)=>{
    // let {title, description,  image, price, location, country  } = req.body
    // res.render("listings/index.ejs",{alllist});
    const newListing = new Listing(req.body.list);
    await newListing.save();
    res.redirect("/listings");
});

app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});



//edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
});

//update route
app.put("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.list});
    res.redirect(`/listings/${id}`);

})
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("listings/show.ejs",{list});
});

app.delete("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id, {...req.body.list});
    console.log(deletedList);
    res.redirect("/listings");
})



app.listen(port, ()=>{
    console.log("listening on post ",port);
} );