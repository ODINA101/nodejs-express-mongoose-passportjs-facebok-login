const mongoose = require('mongoose')


var UserSchema = new mongoose.Schema({
    facebookId: {
        type: String,
        required: false
    },
    method: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: false

    }
}, { timestamps: true });


const User = mongoose.model('User', UserSchema);
module.exports = User;