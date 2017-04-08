const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  content: {type: String, required: true},
  publishDate: {type: String, required: true}
  });

blogSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()});

blogSchema.methods.apiRepr = function() {

  return {
    title: this.title,
    author: this.authorString,
    content: this.content,
    created: this.publishDate,
    postId: this._id
  };
}

const Blog = mongoose.model('Blogs', blogSchema);

module.exports = {Blog};