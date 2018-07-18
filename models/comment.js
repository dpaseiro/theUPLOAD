const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema =new Schema({
    username: String,    
    // date: Date.now(),
    comment: String,
    mediaId: String
},
    {timestamps: true}
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;