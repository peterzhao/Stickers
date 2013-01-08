var mongoose = require('mongoose');
var stickerSchema = mongoose.Schema({
    title: {type: String, required: true}, 
    status: {type:String, required: false}
});
var Sticker = mongoose.model("Sticker", stickerSchema);
module.exports = Sticker;
