var methodOverride  = require("method-override"),
expressSanitizer    = require("express-sanitizer"),
mongoose            = require("mongoose"),
express             = require("express"),
app                 = express ();


const PORT = process.env.PORT || 9000

 //create db and connect mongodb to app
mongoose.connect('mongodb://localhost:27017/BlogApp', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
//
app.use(express.urlencoded({ extended: true}));
//to sanitize user input to remove unwanted script and submit pure html// here we tell express to use express-sanitizer//It must 
app.use(expressSanitizer());
//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static('public'));
//Tell app to use methodOverride and pass the argument you want to use,here mine is _method//MethodOverride here listens to _method as config below by me
app.use(methodOverride('_method'));



//Mongoose/Model Config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body:String,
    created: {type: Date, default: Date.now}
});
//compile campground into a model
var Blog = mongoose.model("Blog", blogSchema);


//RESTFUL ROUTES~
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
    // console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body)
    // console.log("==================================");
    // console.log(req.body);
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
});
//find by id and update and redirect 
//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    // Blog.findByIdAndUpdate(id, newData, Callback function)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//DElete Route
//FindByIdAndremove
app.delete("/blogs/:id", function(req, res){
   Blog.findByIdAndDelete(req.params.id, function(err){
  if (err){
    res.redirect("/blogs");
  } else{
    res.redirect("/blogs");
  }
   });
});

app.listen(PORT, function(){
    console.log("BlogApp By Psalmyjay, SERVER STARTED");
});