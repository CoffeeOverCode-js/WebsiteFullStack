const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;

const credentialSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userID: {
        type: ObjectId,
        required: false
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Credentials = mongoose.model('Credential', credentialSchema, 'credentials');

module.exports = Credentials;