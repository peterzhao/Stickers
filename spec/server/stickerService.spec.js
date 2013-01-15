var StickerService = require('./../../lib/stickerService');
var Sticker = require('./../../lib/sticker');
var Q = require('q');
var helper = require('./testHelper');


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
         done();
       });
     });    
  });



});
