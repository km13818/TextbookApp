

var models = require('../models');

exports.retrieveOffers = function(req, res) { 
  var projectID = req.params.id;
  console.log("projectID: " + projectID);
  // query for the specific project and
  models.Project
    .find({"_id" : projectID })
    .exec(afterQuery);
  // call the following callback

  function afterQuery(err, projects) {
    if(err) console.log(err);
    res.json(projects[0]);
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

/*
exports.deleteProject = function(req, res) {
  var projectID = req.params.id;
  models.Project
    .find({"_id" : projectID })
    .remove()
    .exec(afterDelete);
  function afterDelete(err, projects) {
    if(err) console.log(err);
    res.send();
  }

  // find the project and remove it
  // YOU MUST send an OK response w/ res.send();
}*/