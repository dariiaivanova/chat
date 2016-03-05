var express = require('express');
var morgan = require('morgan');
var config = require('config');
var log = require('libs/log')(module);
var errorHandler = require('error-handler');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Constructing the app
var app = express();

//Setting app properties
var port = config.get('port');
app.set('port', port);
app.engine('ejs', require('ejs-locals')); // 'ejs' files will be processed with ejs-locals
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//Creating HTTP Server
var http = require('http');
http.createServer(app).listen(port, function(){
  log.info("Express server is listening on port "+port);
});


//Middleware

// Logger
if(app.get('env') == 'development'){
  app.use(morgan('dev'));
} else {
  app.use(morgan('common'));
}

app.use(bodyParser.urlencoded({// reads form sent with POST
  extended:true
}));
app.use(bodyParser.json()); // json data  - > req.body...
app.use(cookieParser()); // parses req.headers -> req.cookies



app.use(express.static('public'));

// Request handler
app.get('/', function(req, res, next){
  res.render('index', {

  });
});


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
      app.use(errorHandler())
    } else {
      res.status(500).send('Something broke!');
    }
});

