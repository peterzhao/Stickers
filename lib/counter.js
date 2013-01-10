var mongoose = require('mongoose');
var Counters = mongoose.Schema({
  _id:String, // the schema name
  count: Number
});

Counters.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

var Counter = mongoose.model('Counter', Counters);

/**
 * Increments the counter associated with the given schema name.
 * @param {string} schemaName The name of the schema for which to
 *   increment the associated counter.
 * @param {function(err, count)} The callback called with the updated
 *   count (a Number).
 */
function incrementCounter(schemaName, callback){
  Counter.findAndModify({ _id: schemaName }, [], 
    { $inc: { count: 1 } }, {"new":true, upsert:true}, function (err, result) {
      if (err)
        callback(err);
      else
        callback(null, result.count);
  });
}

module.exports = incrementCounter;
