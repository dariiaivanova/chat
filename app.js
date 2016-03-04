var express = require('express');
var app = express();
app.use(express.static('/'));

var config = require('config');
var log = require('libs/log')(module);

var port = config.get('port');
app.set('port', port);

//Creating HTTP Server

var http = require('http');
http.createServer(app).listen(port, function(){
  log.info("Express server is listening on port "+port);
});


//Middleware

app.use(function(req, res, next){
  if(req.url == '/'){
    res.end("Hi there");
  } else {
    next();
  }
});

app.use(function(req, res, next){
  if(req.url ==  '/forbidden'){
    next(new Error());
  } else {
    next();
  }
});


app.use(function(req, res, next){
  if(req.url ==  '/test'){
    res.end("Test page")
  } else {
    next();
  }
});

app.use(function(req, res){
  res.status(404).send("Page not Found");
});


//Error handler
  app.use(function(err, req, res, next) {
    if (app.get('env') == 'development'){
      res.send(err.stack);
      console.error(err.stack);
    } else {
      res.status(500).send('Something broke!');
    }
});
