/* eslint no-console: 0 */

import environment from './environment';
environment();

import express from 'express';
import React from 'react';
import Router from 'react-router';
import routes from './routes';
const app = express();

app.set('views', './views');  
app.set('view engine', 'jade');

app.get('/health', function (req, res) {
  res.end();
});

import dynamoose from 'dynamoose';

if (process.env.DYNAMODB_LOCAL_ENDPOINT){
  dynamoose.local(process.env.DYNAMODB_LOCAL_ENDPOINT);
}

let Cat = dynamoose.model('Cat', { id: Number, name: String });

app.get('/dynamodb', function (req, res) {
  let garfield = new Cat({ id: 666, name: 'Garfield' });
  garfield.save();

  Cat.get(666).then(function(badCat) {
    res.send(badCat);
  });
});

app.get('/*', function (req, res) {
  Router.run(routes, req.url, Handler => {
    let content = React.renderToString(<Handler />);
    res.render('index', { content: content });
  });
});

module.exports = app;

if (!module.parent) {
  var server = app.listen(3000, function () {  
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
  });
}