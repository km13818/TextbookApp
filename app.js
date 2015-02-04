
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var index = require('./routes/index');

var login = require('./routes/login');
/*var sell = require('./routes/sell');*/
// Example route
// var user = require('./routes/user');

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

app.post('/postOffer', function(req, res){
    var username = req.param('username');
    console.log("Logged in as: " + username);
    res.render( "index", { 'username':username } );
});
app.post('/display_offers', function(req, res){
    var username = req.param('username');
    console.log("Logged in as: " + username);
    res.render( "currentoffers", { 'username':username } );
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
    res.render( "inbox", { 'username':username } );
});
app.post('/my_offers', function(req, res){
    var username = req.param('username');
    console.log("Logged in as: " + username);
    res.render( "myoffers", { 'username':username } );
});

// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
