var Q = require('q');
var counter = require('./counter');
var Sticker = require('./sticker');
var mongoose = require('mongoose');

var StickerService = {
  save: function(attrs, callback){
    if(attrs._id){
      Sticker.findById(attrs._id, function(err, sticker){
        if(err) return callback(err);
        for(var prop in attrs){
          sticker[prop] = attrs[prop];
        }
        sticker.lastModified = new Date();
        sticker.save(callback);
      });
    }else{
      var sticker = new Sticker(attrs);
      counter("sticker", function(err, id){
        if(err) return callback(err);
        sticker._id = id.toString();
        sticker.lastModified = new Date();
        sticker.save(callback);
      });
    }
  }

//  save: function(attrs){ 
//    if(attrs._id){
//      var sticker = new Sticker(attrs);
//      return Q.ninvoke(sticker, "save")
//              .then(function(arr){
//                return arr[0];
//              });
//    }else{
//      return Q.nfcall(counter, "sticker")
//        .then(function(id){
//          attrs._id = id.toString();
//          var sticker = new Sticker(attrs);
//          return Q.ninvoke(sticker, "save");
//        }).then(function(arr){
//          return arr[0];
//        }); 
//    }
//  }
}; 

module.exports = StickerService;
