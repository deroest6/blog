//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-jantsen:test123@cluster0-ivwmp.mongodb.net/BlogDB',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
// mongoose.connect("mongodb://localhost:27017/blogDB", {
//   useNewUrlParser: true
// });

// Define a Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

// Define Schema Model
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        posts: posts
      });
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  console.log("requestPostId = " + requestedPostId);

  Post.findOne({_id: requestedPostId}, function(err, post) {
    if (!err) {
      console.log(post);

          res.render("post", {
            title: post.title,
            content: post.content
          });

    }
  });

});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
