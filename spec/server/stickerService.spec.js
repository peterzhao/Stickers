var StickerService = require('./../../lib/stickerService');
var Sticker = require('./../../lib/sticker');
var Q = require('q');
var helper = require('./testHelper');
var _ = require('underscore');


describe("StickerService", function(){

  beforeEach(function(){
    helper.openDb();
  });

  afterEach(function(){
    helper.closeDb();
  });


  it("should create sticker", function(done){
    var start = new Date();
    StickerService.save({title: 'testing2'}, function(err, sticker){
      if(err) console.log(err);
      expect(sticker).not.toBeNull();
      expect(sticker.title).toEqual('testing2');
      expect(sticker._id).not.toBeNull();
      expect(sticker.lastModified >= start).toBe(true);
      done();
    });
  });

  it("should update sticker", function(done){
     var start = new Date();
     var id =  new Date().getTime().toString();
     var sticker = new Sticker({status:'new', title: 'testing3', _id: id});
     sticker.save(function(err, object){
       if(err) console.log(err);
       expect(object.status).toBe('new');
       object.status = 'done';
       StickerService.save(object, function(err2, object2){
         if(err2) console.log(err2);
         expect(object2._id).toBe(id);
         expect(sticker.status).toBe('done');
         expect(sticker.lastModified >= start).toBe(true);
         expect(object2.toObject().__v).toBe(1); //version incremented
         done();
       });
     });    
  });

  it("should get stickers", function(done){
    var fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(-5);
    var twoDaysAgo = new Date();
    twoDaysAgo.setDate(-2);
    var sticker1 = new Sticker({status: 'new', title:'abc1', lastModified: fiveDaysAgo});
    sticker1._id = new Date().getTime().toString();
    var sticker2= new Sticker({status: 'new', title:'abc2', lastModified: twoDaysAgo});
    sticker1.save(function(err){
      if(err) return console.log(err);
      sticker2._id = new Date().getTime().toString();

      sticker2.save(function(err2){
        if(err2) return console.log(err2);
        StickerService.get(twoDaysAgo, function(err3, stickers){
          if(err3) return console.log(err3);
          var ids = _.map(stickers, function(sticker){ return sticker._id;});
          expect(_.contains(ids, sticker1._id)).toBe(false);
          expect(_.contains(ids, sticker2._id)).toBe(true);
          done();
        });
      });
    });

  });

});
