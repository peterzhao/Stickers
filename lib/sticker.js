var mongoose = require('mongoose');
var stickerSchema = mongoose.Schema({
    title: {type: String, required: true},
    _id: {type: String, required:true},
    id: false,
    status: {type:String, required: false},
    body: {type: String},
    lastModified: {type: Date}
});
stickerSchema.index({lastModified:1});
var Sticker = mongoose.model("Sticker", stickerSchema);
module.exports = Sticker;
