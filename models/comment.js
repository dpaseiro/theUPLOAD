const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema =new Schema({
    username: String,  
    userID: {type: Schema.Types.ObjectId, ref:'User'},  
    // date: Date.now(),
    comment: String,
    mediaId: {type: Schema.Types.ObjectId, ref:'Video'}
},
    {timestamps: true}
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;