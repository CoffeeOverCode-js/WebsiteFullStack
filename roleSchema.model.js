const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    roleName: {
        type: String,
        required: true
    }
});

const Roles = mongoose.model('Roles', roleSchema, 'roles');

module.exports = Roles;