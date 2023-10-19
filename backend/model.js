const mongoose = require("mongoose");
const urlSchema = new mongoose.Schema({
    longURL: {
        type: String,
        required: false
    },
    shortURL: {
        type: String,
        required: true,
    },
    shortUrlId: {
        type: String,
        required: true,
        unique: true
    }
,
    clicks:{
        type:Number,
        required: true,
        default:0
    }
});
module.exports = mongoose.model("URL", urlSchema);