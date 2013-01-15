var Sticker = require('./../lib/sticker')
var StickerService = require('./../lib/stickerService')

exports.list = function(req, res){
  Sticker.find(function(err, stickers){
    if(!err)
      return res.send(stickers);
    else
      return console.log(err);
  });
}

exports.save = function(req, res){
  StickerService.save(req.body, function(err, sticker){
    if(err) {
      console.log(err);
      return res.send(err, 500);
    }
    res.send(sticker);    
  });
}

