var express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    
// APP config   
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//sanitizer only after bodyparser
app.use(expressSanitizer());


// MONGOOSE/MODEL config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

/*Blog.create({
    title: "Test Blog",
    image: "https://images.unsplash.com/photo-1483388147740-e5c70536042e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=834a4f5ebd2243ce8ac84a94393519b0&dpr=1.25&auto=format&fit=crop&w=767&h=511&q=60&cs=tinysrgb",
    body: "Hi, welcome blabla bla nlajdjjdskkdfvfiihbfvh"
    
});*/

//RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});


//CREATE Route
app.post("/blogs", function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
             //redirect
        } else{
            res.redirect("/blogs");
        }
    });
   
});


//SHOW route

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("error");
        } else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT Route

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
    
});

//UPDATE route

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE Route

app.delete("/blogs/:id", function(req, res){
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, req.body.blog, function(err){
        if(err){
             //redirect somewhere
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
   
});


    
    
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});