var counter = require('./../../lib/counter');
var helper = require('./testHelper');


describe("Counter", function(){

  beforeEach(function(){
    helper.openDb();
  });

  afterEach(function(){
    helper.closeDb();
  });

  it("should increment the count", function(done){
    
    counter("test", function(err, result){
      expect(err).toBeNull();
      expect(result).not.toBeNull();
      counter("test", function(err, result2){
        expect(err).toBeNull();
        expect(result2).toBeGreaterThan(result);
        done();
      });
    });
  });
});

