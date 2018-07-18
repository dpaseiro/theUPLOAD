const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    title: String,
    description: String,
    url: String,
    mediaName: String,
    userID: String,
    comments: [{type: Schema.Types.ObjectId}] 
    },
    {timestamps: true}
);

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;