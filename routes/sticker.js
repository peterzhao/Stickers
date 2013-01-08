var Sticker = require('./../lib/sticker')

exports.list = function(req, res){
  Sticker.find(function(err, stickers){
    if(!err)
      return res.render('stickers', {stickers: stickers, title: 'Stickers'});
    else
      return console.log(err);
  });
}

exports.create = function(req, res){
  var sticker = new Sticker({title: req.body.title});
  sticker.save(function(err, sticker){
    if(!err)
      res.redirect('/stickers');
    else
      console.log(err);
  });
}

