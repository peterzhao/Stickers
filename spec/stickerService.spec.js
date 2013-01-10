var StickerService = require('./../lib/stickerService');
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
   StickerService.create({title:'testing'}).then(function(sticker){
     expect(sticker).not.toBeNull();
     console.log(sticker);
     expect(sticker.title).toEqual('testing');
     console.log(sticker.id);
     done();
    }, function(err){
      console.log(err);
    });
  });
});
