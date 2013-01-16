var counter = require('./counter');
var Sticker = require('./sticker');
var mongoose = require('mongoose');

var StickerService = {
  save: function(attrs, callback){
    if(attrs._id){
      Sticker.findById(attrs._id, function(err, sticker){
        if(err) return callback(err);
        //if(sticker.toObject().__v != attrs.__v) return callback(new Error("outdate data posted"));
        for(var prop in attrs){
          sticker[prop] = attrs[prop];
        }
        sticker.lastModified = new Date();
        sticker.increment();
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
  },

    get: function(lastModified, callback){
      var query = Sticker.where();
      if(lastModified)
        query = query.where('lastModified').gte(lastModified);
      query.exec(callback);
    }
  

};
module.exports = StickerService;
