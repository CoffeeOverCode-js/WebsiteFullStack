const mongoose = require('mongoose');

const orgUnitsSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    OU_Name: {
        type: String,
        required: true
    },
    credentialsID: {
        type: Array,
        required: true
    }
});

const OrgUnit = mongoose.model('OrgUnits', orgUnitsSchema, 'ou');

module.exports = OrgUnit;