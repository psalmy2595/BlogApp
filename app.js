var bodyParser = require("body-parser");
var express = require("express");
var app = express ();
var mongoose = require("mongoose");
const PORT = process.env.PORT || 9000
 
//APP CONFIG
app.use(express.urlencoded({ extended: true}));
app.set("view engine", "ejs");
//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static('public'));
//create db and connect mongodb to app
mongoose.connect('mongodb://localhost:27017/BlogApp', {useNewUrlParser: true, useUnifiedTopology: true});


//Mongoose/Model Config
var blogSchema = mongoose.Schema({
    tittle: String,
    image: String,
    body:String,
    created: {type: Date, default: Date.now}
});
//compile campground into a model
var Blog = mongoose.model("Blog", blogSchema);


//RESTFUL ROUTES
// INDEX ROUTE
app.get("/", function(req, res){
    res.redirect("/blogs");

});
//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE ROUTE

//Display all Blogs from Db Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR");
        } else {
            res.render("index", {blogs: blogs}); 
        }
    });
    
});



app.listen(PORT, function(){
    console.log("BlogApp By Psalmyjay, SERVER STARTED");
});