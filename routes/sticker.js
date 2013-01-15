var Sticker = require('./../lib/sticker')
var StickerService = require('./../lib/stickerService')

exports.list = function(req, res){
  StickerService.get(req.params.lastModified, function(err, stickers){
    if(err){
      console.log(err);
      res.send(err, 500);
    }
    return res.send(stickers);      
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

