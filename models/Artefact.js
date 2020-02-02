const mongoose = require('mongoose');
//const user = require('./User');
const Schema = mongoose.Schema;

const ArtefactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ratings: {
        type: Map,
        of: Number
    }
});

module.exports = Artefact = mongoose.model('artefact', ArtefactSchema);