var Sticker = require('./../lib/sticker')
var mongoose = require('mongoose');


describe("Sticker", function(){

  beforeEach(function(){
    mongoose.connect('mongodb://localhost/stickersTest');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'db connection error:'));
  });

  afterEach(function(){
    mongoose.disconnect();
  });

  it("should create a new one", function(done){
      var sticker = new Sticker({title: 'test sticker'});
      sticker.save(function(err, sticker){
        expect(err).toBeNull();
        Sticker.findById(sticker.id, function(err, obj){
          expect(obj.id).toBe(sticker.id);
          //console.log(obj.id);
          done();
        });
      });

            
  });
});
