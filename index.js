
/**
 * Module dependencies.
 */

var _ = require('lodash');
var csv = require('csv');
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var querystring = require('querystring');
var util = require('util');

/**
 * Express
 */

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//// routes

app.get('/', function (req, res) {
  res.render('index', req.query);
});

app.post('/', function (req, res) {
  // Query FB graph API
  // console.log('req.body', util.inspect(req.body), querystring.stringify(req.body));
  https.get('https://graph.facebook.com/search?' + querystring.stringify(req.body), function (response) {
    var chunks = [];
    response.on('data', function (chunk) {
      // console.log('chunk', util.inspect(chunk));
      chunks.push(new Buffer(chunk));
    });
    response.on('end', function () {
      var buffer = Buffer.concat(chunks);
      // console.log('buffer', util.inspect(buffer));
      var json = JSON.parse(buffer.toString());

      // Transform the results
      var rows = _.reduce(json.data, function (result, record) {
        result.push([record.name, record.category, _.pluck(record.category_list, 'name').join(', '), record.location.street, record.location.city, record.location.state, record.location.country, record.location.zip]);
        return result;
      }, [['Name', 'Category', 'Sub-Categories', 'Street', 'City', 'State', 'Country', 'Zip']]);

      // Create CSV out of response
      csv().from(rows).to(function (data) {
        // console.log('csv', util.inspect(data));
        res.attachment('facebook.csv');
        res.type('text/csv');
        res.send(data);
      });
    });
  }).on('error', function (error) {
    console.error('Error performing graph search');
    res.send(400);
  });
});

// start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
