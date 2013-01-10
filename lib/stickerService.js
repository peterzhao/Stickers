var Q = require('q');
var counter = require('./counter');
var Sticker = require('./sticker');
var mongoose = require('mongoose');

var StickerService = {
  create: function(attrs){    
    return Q.nfcall(counter, "sticker")
      .then(function(id){
        attrs._id = id.toString();
        var sticker = new Sticker(attrs);
        console.log(sticker);
        return Q.ninvoke(sticker, "save");
      }).then(function(arr){
        return arr[0];
      }); 
  }
}; 

module.exports = StickerService;
