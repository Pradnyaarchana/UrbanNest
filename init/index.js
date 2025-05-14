const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const initdata = require("./data.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/urbannest";
const Listing = require("../models/listing.js");
const { object } = require("joi");

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

const initDB = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({
        ...obj,
        owner : "6823798690027ac8c3a709dc"
    }));
    await Listing.insertMany(initdata.data);
    console.log("DB initialized");
}

initDB();