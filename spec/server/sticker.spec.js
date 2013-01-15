var Sticker = require('./../../lib/sticker')
var helper = require('./testHelper')
var mongoose = require('mongoose');


describe("Sticker", function(){

  beforeEach(function(){
    helper.openDb();
  });

  afterEach(function(){
    helper.closeDb();
  });

  it("should create a new one", function(done){
      var sticker = new Sticker({title: 'test sticker', _id: new Date().getTime()});
      sticker.save(function(err, obj){
        expect(err).toBeNull();
        Sticker.findById(sticker._id, function(err, obj2){
          expect(obj2._id).toBe(sticker._id);
          done();
        });
      });

            
  });
});
