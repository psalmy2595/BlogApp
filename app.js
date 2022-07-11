var bodyParser = require("body-parser");
var flash = require('flash-express');
var express = require("express");
var app = express ();
var mongoose = require("mongoose");
const PORT = process.env.PORT || 9000
 
//APP CONFIG
app.use(express.urlencoded({ extended: true}));
app.set("view engine", "ejs");
  app.use(flash());
//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static('public'));
//create db and connect mongodb to app
mongoose.connect('mongodb://localhost:27017/BlogApp', {useNewUrlParser: true, useUnifiedTopology: true});


//Mongoose/Model Config
var blogSchema = mongoose.Schema({
    title: String,
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
    app.post("/blogs", function(req, res){
    //Create blog and Redirect
    //Blog.create(data,  callback function()))
        Blog.create(req.body.blog, function(err,newBlog){
            if(err){
                res.render("new");
            } else {
                //redirect to index   
                res.redirect("/blogs");
            }
            });
        });

//Display all Blogs from Db Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR");
        } else {
            res.render("index", {blogs: blogs}); 
        }
    });

//Redirect /blog url to index url
app.get("/blog", function(req, res){
    res.redirect("/blogs");
});
      
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
     Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
           res.redirect("/blogs");
        } else {
            // console.log(foundBlog)
          res.render("show", {blog: foundBlog});
           
        }
    });
});

//the forM has to be pre filled with tHE data otherwise we wont be editing rather typing stuff over.
//1st find the actual blog we wanna edit in the edit route.
//using the id to find the blog to edit. 
// the redirect to the edit page then pass data {blog: foundBlog}
// we got to the edit page usong ejs to output it
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
    if (err){ 
        res.redirect("/blogs");   
    } else {
        res.render("edit", {blog: foundBlog});
    }
   });
    res.render('edit');

});


app.listen(PORT, function(){
    console.log("BlogApp By Psalmyjay, SERVER STARTED");
});