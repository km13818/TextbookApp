
var Mongoose = require('mongoose');


var LoginSchema = new Mongoose.Schema({
  // fields are defined here
  "username": String,
  "pass" : String,
});

exports.Logins = Mongoose.model('Logins', LoginSchema);
console.log("models.js running");

