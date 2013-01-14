var mongoose = require('mongoose');

var TestHelper = {
  openDb: function(){
    mongoose.connect('mongodb://localhost/stickersTest');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'db connection error:'));
  },

  closeDb: function(){
    mongoose.disconnect();
  }

};

module.exports = TestHelper;

