
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var index = require('./routes/index');
var login = require('./routes/login');

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', login.view);
app.post('/home', function(req, res){
    var username = req.param('username');
    console.log("Logged in as: " + username);
    res.render( "index", { 'username':username } );
});
app.post('/buy', function(req, res){
    var username = req.param('username');
    console.log("Log buy");
    res.render( "buy", { 'username':username } );
});
app.post('/sell', function(req, res){
    var username = req.param('username');
    console.log("Log sell");
    res.render( "sell", { 'username':username } );
});


app.get('/create_account', function(req, res){
    console.log("Log create account");
    res.render( "createaccount");
});

app.post('/create_account', function(req, res){
    console.log("account created");
    res.render("login");
});

app.post('/postOffer', function(req, res){
    var username = req.param('username');
    console.log("Logged in as: " + username);
    res.render( "index", { 'username':username } );
});
app.post('/display_offers', function(req, res){
    var username = req.param('username');
    console.log("Logged in as: " + username);
    var offers = require('./offers.json');
    res.render( "currentoffers", offers );
});
//TODO: append offers to request
app.post('/search_offers', function(req, res){
    var username = req.param('username');
    console.log("Logged in as: " + username);
    res.render( "currentoffers", { 'username':username } );
});

app.post('/inbox', function(req, res){
    var username = req.param('username');
    console.log("Logged in as: " + username);
    var dataJson = require('./inbox.json');
    dataJson.username = username;
    res.render( "inbox", dataJson );
});
app.post('/transactions', function(req, res){
    var username = req.param('username');
    var dataJson = require('./transactions.json');
    dataJson.username = username;
    console.log("Logged in as: " + username);
    res.render( "transactions", dataJson );
});

// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
