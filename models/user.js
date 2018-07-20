const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
        // unique: true
    },
    password: String,
    name:   String,
    about: String,
    image: String,
    // array of URLs
    videos: [{type: Schema.Types.ObjectId}]},
    {timestamps: true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;