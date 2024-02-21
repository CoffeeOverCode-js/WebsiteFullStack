const mongoose = require('mongoose')
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 1
    },
    orgUnits: {
        type: Array,
        required: true
    },
    divisions: {
        type: Array,
        required: true
    },
    credentialsID: {
        type: Number,
        required: true
    }
});


const User = mongoose.model('User', userSchema, 'user');

module.exports = User;