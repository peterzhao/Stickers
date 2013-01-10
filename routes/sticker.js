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

exports.create = function(req, res){
  StickerService.create(req.body)
  .then(
    function(sticker){ res.send(sticker);},
    function(err){ console.log(err);}
  );
}

