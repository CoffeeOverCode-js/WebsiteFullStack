const mongoose = require('mongoose')

const divisionSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    divisionName: {
        type: String,
        required: true
    },
    credentialsID: {
        type: Array,
        required: true
    }
})

const Division = mongoose.model('Division', divisionSchema, 'division');

module.exports = Division;