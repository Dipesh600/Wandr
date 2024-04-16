// models/BlogPost.js

const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  publicationDate: Date,
  imageUrl: String
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
