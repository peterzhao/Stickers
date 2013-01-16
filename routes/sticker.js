var Sticker = require('./../lib/sticker')
var StickerService = require('./../lib/stickerService')

exports.list = function(req, res){
  var lastModified
  if(req.query.lastModified) lastModified = new Date(req.query.lastModified);
  StickerService.get(lastModified, function(err, stickers){
    if(err){
      console.log(err.stack);
      res.send(500, {error: err.message});
    }
    return res.send(stickers);      
  });
}

exports.save = function(req, res){
  StickerService.save(req.body, function(err, sticker){
    if(err) {
      console.log(err.stack);
      return res.send(500, {error: err.message});
    }
    res.send(sticker);    
  });
}

