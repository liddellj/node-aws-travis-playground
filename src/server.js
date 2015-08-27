/* eslint no-console: 0 no-unused-vars: 0 */

import './environment';
import express from 'express';
import React from 'react';
import Router from 'react-router';
import routes from './routes';
import Cat from './models/cat';
const app = express();

app.set('views', './views');  
app.set('view engine', 'jade');

app.get('/health', function (req, res) {
  res.end();
});

app.get('/dynamodb', function (req, res, next) {
  let garfield = new Cat({ id: 666, name: 'Garfield' });

  garfield.save(() => {
    Cat.get(666, (err, badCat) => {
      if (err){
        next(err);
      } else {
        res.send(badCat);
      }
    });
  });
});

app.get('/*', function (req, res) {
  Router.run(routes, req.url, Handler => {
    let content = React.renderToString(<Handler />);
    res.render('index', { content: content });
  });
});

app.use((err, req, res, next) => {
  res.status(500);
  res.send(err);
});

module.exports = app;

if (!module.parent) {
  var server = app.listen(3000, function () {  
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
  });
}