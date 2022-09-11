const mongoose = require('mongoose');
const shortId = require('shortid');

const urlSchema = mongoose.Schema({
    full : {
        type: String,
        required: true
    },
    short : {
        type: String,
        required:true,
        default : shortId.generate
    },
    clicks: {
        type: String,
        required: true,
        default:0
    }
});

module.exports = mongoose.model('urls',urlSchema);