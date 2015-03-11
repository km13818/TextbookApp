
var Mongoose = require('mongoose');


var LoginSchema = new Mongoose.Schema({
  // fields are defined here
  "username": String,
  "pass" : String,
});

var OffersSchema = new Mongoose.Schema({
	"title": String,
	"author": String,
	"seller": String,
	"isbn": String,
	"course": String,
	"condition": String,
	"imageurl": String,
	"location": String,		
	"availability": String,
	"price": String
});

var TransactionSchema = new Mongoose.Schema({
	"buyer": String,
	"seller": String,
	"title": String,
	"isbn": String,
	"location": String,
	"availability": String
});

exports.Logins = Mongoose.model('Logins', LoginSchema);
exports.Offers = Mongoose.model('Offers', OffersSchema);
exports.Transactions = Mongoose.model('Transactions', TransactionSchema);
console.log("models.js running");

