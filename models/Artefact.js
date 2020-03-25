const mongoose = require('mongoose');
//const user = require('./User');
const Schema = mongoose.Schema;

const ArtefactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    materials: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    tips: {
        type: String,
        required: true
    },
    ratings: {
        type: Map,
        of: Number
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = Artefact = mongoose.model('artefact', ArtefactSchema);