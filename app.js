const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/urbannest');
}

app.get("/", (req, res)=>{
    res.send("working");
})

app.listen(port, ()=>{
    console.log("listening on post ",port);
} );