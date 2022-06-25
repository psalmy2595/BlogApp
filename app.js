var bodyParser = require("body-parser");
var express = require("express");
var app = express ();
var mongoose = require("mongoose");
const PORT = process.env.PORT || 9000

app.use(express.urlencoded({ extended: true}));
app.set("view engine", "ejs");

//create db and connect mongodb to app
mongoose.connect('mongodb://localhost:27017/BlogApp', {useNewUrlParser: true, useUnifiedTopology: true});


//Create our schema
var blogSchema = mongoose.Schema({
    tittle: String,
    image: String,
    body:String,
    created: {type: Date, default: Date.now}
});
//compile campground into a model
var Blog = mongoose.model("Blog, blogSchema");









app.listen(PORT, function(){
    console.log("Yelpcamp By Psalmyjay, SERVER STARTED");
});