

var models = require('../models');

exports.retrieveOffers = function(req, res) {
  
  // query for the specific project and
  models.Offers
    .find()
    .exec(afterQuery);

  // call the following callback

  function afterQuery(err, offers) {
    if(err) console.log(err);
    console.log(offers);
    var username = req.param('username');
    console.log("Logged in as: " + username); 
    res.render( "currentoffers", {'offers' : offers, 'username' : username} );



  }
}

exports.retrieveTransactions = function(req, res) {
  var username = req.param('username');
  var purchases;
  var sales;
  var pendingSales;
  // query for the specific project and
  models.Transactions
    .find({'buyer' : username})
    .exec(afterQuery);

  // call the following callback

  function afterQuery(err, retrievedPurchases) {
    if(err) console.log(err);
    purchases = retrievedPurchases;
    console.log("Logged in as: " + username); 
    console.log("purchases retrieved: " + purchases);
    models.Transactions
    .find({'seller' : username})
    .exec(afterSalesRetrieval);
  }
  function afterSalesRetrieval(err, retrievedSales) {
    if(err) console.log(err);

    sales = retrievedSales;
        console.log("sales retrieved: " + sales);
    models.Offers
    .find({'seller' : username})
    .exec(afterPendingSalesRetrieval);
  }
  function afterPendingSalesRetrieval(err, retrievedPendingSales) {
    if(err) console.log(err);

    pendingSales = retrievedPendingSales;
        console.log("sales retrieved: " + sales);
    res.render("transactions", { 'sales': sales, 'purchases' : purchases, 'username' : username, 'pendingsales' : pendingSales});
  }

}
exports.searchOffers = function(req, res) {
  var username = req.param('username');

  var title= req.param('title');
  var author= req.param('author');
  var isbn= req.param('isbn');
  var course= req.param('course');
  // query for the specific project and

  if(title != '' && author == '' && isbn == '' && course == '') {
     models.Offers
    .find({'title' : title})
    .exec(afterQuery); 
  }
  else if(title =='' && author != '' && isbn == '' && course == ''){
     models.Offers
    .find({'author' : author})
    .exec(afterQuery); 
  }
  else if(title =='' && author == '' && isbn != '' && course == ''){
     models.Offers
    .find({'isbn' : isbn})
    .exec(afterQuery); 
  }
  else if(title == '' && author == '' && isbn == '' && course != '') {
     models.Offers
    .find({'course' : course})
    .exec(afterQuery); 
  
  }
  else {
     models.Offers
    .find({'course' : course, 'title': title, 'author': author, 'isbn': isbn})
    .exec(afterQuery);     
  }

  models.Offers
    .find({'title' : title, 'author': author, 'isbn' : isbn})
    .exec(afterQuery);

  // call the following callback

  function afterQuery(err, retrievedOffers) {
    if(err) console.log(err);
    res.render("currentoffers", { 'offers': retrievedOffers, 'username': username});
  }

}
exports.verifyAccount = function(req, res) {
  var username = req.param('username');
  var pass = req.param('pass');

  // query for the specific project and
  models.Logins
    .find({"username" : username, "pass" : pass })
    .exec(afterQuery);
  // call the following callback

  function afterQuery(err, retJson) {
    if(err) console.log(err);
    var jsonStr = JSON.stringify(retJson);
    console.log(jsonStr.length);
    console.log(jsonStr);
    console.log(jsonStr == '[]');
    if(jsonStr=='[]') {
      res.render("login", {'errorStr' : 'Invalid Login'});
    }
    else {
      res.render("index", {'username' : username});
    }
  }
}

exports.createAccount = function(req, res) {
  var form_data = req.body;
  //console.log(form_data);
  var username = req.param('username');
  var pass = req.param('pass');
 // console.log(username + pass);
  var newLogins = new models.Logins({ 'username' : username,
  'pass' : pass});

  newLogins.save(afterSaving);
  function afterSaving(err) { // this is a callback
    if(err) {
      console.log(err); 
      res.send(500); 
    }
    res.redirect('/');
  }
  // make a new Project and save it to the DB
  // YOU MUST send an OK response w/ res.send();
}
exports.deleteTransaction = function(req,res) {
  var username = req.param('username');
  var title = req.param('title');
  var buyer = req.param('buyer').trim();
  var seller = req.param('seller').trim();
  var isbn = req.param('isbn');

  console.log("dbaccess deleteTransaction: " + username + title + buyer + seller + isbn );

  if (buyer == '') {
    models.Transactions
    .find({"seller" : seller, "title" : title, "isbn" : isbn })
    .remove()
    .exec(afterDelete);
  }
  if (seller == '') {
    models.Transactions
    .find({"buyer" : buyer, "title" : title, "isbn" : isbn })
    .remove()
    .exec(afterDelete);
  }
  function afterDelete(err, retJson) {
      if(err) console.log(err);
      res.send();
   //   res.render('currentoffers', {'username': username});
  }
}
exports.deleteOffer = function(req,res) {
  var username = req.param('username');
  var title = req.param('title');
  var seller = req.param('seller').trim();
  var isbn = req.param('isbn');


  console.log("dbaccess deleteOffer: " + username + title + seller + isbn );

  models.Offers
    .find({"seller" : seller, "title" : title, "isbn" : isbn})
    .remove()
    .exec(afterDelete);


  function afterDelete(err, retJson) {
      if(err) console.log(err);
      res.send();
    //  res.render('currentoffers', {'username': username});
  }
}

exports.makeTransaction = function(req,res){
  var title = req.param('title');
  var buyer = req.param('buyer');
  var seller = req.param('seller');
  var isbn = req.param('isbn');
  var location = req.param('location');
  var availability = req.param('availability');
  console.log("maketransaction dbaccess: title: " + title + " buyer: " + buyer + " seller: " + seller + " isbn: " + isbn);

  var newTransaction = new models.Transactions({ 
    "buyer": buyer,
    "title": title,
    "seller": seller,
    "isbn": isbn,
    "location": location,
    "availability": availability
  });

  newTransaction.save(afterSaving);
  function afterSaving(err) { 
    if(err) {
      console.log(err); 
      res.send(500); 
    }
    console.log("new transaction inserted");
      models.Offers
    .find({"seller" : seller, "title" : title, "isbn" : isbn })
    .remove()
    .exec(afterDelete);
  }
  function afterDelete(err, retJson) {
      if(err) console.log(err);
      res.send();
  }
}//end makeTransaction
exports.insertOffer = function(req, res) {
  var form_data = req.body;
  //console.log(form_data);

  var title = req.param('title');
  var author = req.param('author');
  var seller = req.param('seller');
  var isbn = req.param('isbn');
  var course = req.param('course');
  var condition = req.param('condition');
  var imageurl = req.param('imageurl');
  var location = req.param('location');
  var availability = "";  

  var sunday = req.param('sunday-checkbox');
  var monday = req.param('monday-checkbox');
  var tuesday = req.param('tuesday-checkbox');
  var wednesday = req.param('wednesday-checkbox');
  var thursday = req.param('thursday-checkbox');
  var friday = req.param('friday-checkbox');
  var saturday = req.param('saturday-checkbox');

  if(!(typeof (sunday) === "undefined")) {
    availability += sunday + ": " + req.param("sunday-av") + "\r\n";
  }
  if(!(typeof (monday) === "undefined")) {
    availability += monday + ": " + req.param("monday-av") + "\r\n";
  }
  if(!(typeof (tuesday) === "undefined")) {
    availability += tuesday + ": " + req.param("tuesday-av") + "\r\n";
  }
  if(!(typeof (wednesday) === "undefined")) {
    availability += wednesday + ": " + req.param("wednesday-av") + "\r\n";
  }
  if(!(typeof (thursday) === "undefined")) {
    availability += thursday + ": " + req.param("thursday-av") + "\r\n";
  }
  if(!(typeof (friday) === "undefined")) {
    availability += friday + ": " + req.param("friday-av") + "\r\n";
  }
  if(!(typeof (saturday) === "undefined")) {
    availability += saturday + ": " + req.param("saturday-av") + "\r\n";
  }

  console.log("availability: "  + availability);

  console.log("LOGGING DAYS: " + sunday + monday + tuesday + wednesday + thursday + friday + saturday);
 // console.log(username + pass);
  var newOffer = new models.Offers({ 
    "title": title,
    "author": author,
    "seller": seller,
    "isbn": isbn,
    "course": course,
    "imageurl": imageurl,
    "condition": condition,
    "location": location,   
    "availability": availability
  });

  newOffer.save(afterSaving);
  function afterSaving(err) { // this is a callback
    if(err) {
      console.log(err); 
      res.send(500); 
    }
    console.log("new offer inserted: " + title + " " + author + " "
      + seller + " " + isbn + " " + imageurl + " " + location + " " + 
      availability +  " ");
    res.render('index', {"username" : seller});
  }
}

