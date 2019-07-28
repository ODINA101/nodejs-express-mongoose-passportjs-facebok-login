const mongoose = require('mongoose')


var PostSchema = new mongoose.Schema({
    title: {
        require: true,
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });


const Post = mongoose.model('Post', PostSchema);
module.exports = Post;