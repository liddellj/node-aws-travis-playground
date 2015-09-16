/* eslint no-console: 0 no-unused-vars: 0 */

import './environment';
import debug from 'debug';
import express from 'express';
import session from 'express-session';
import React from 'react';
import Router from 'react-router';
import routes from './routes';
import crossoverRouter from './routes/crossoverRouter';
import passport from 'passport';
import openidconnect from 'passport-openidconnect';
import models from './models';
import bodyParser from 'body-parser';

const app = express();
const error  = debug('server:error');
const log  = debug('server:log');
const OpenIdConnectStrategy = openidconnect.Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findOne({
    where: {
      profileId: id
    }
  }).then((user) => {
    done(null, user);
  }).catch((err) => {
    done(err);
  });
});

passport.use(new OpenIdConnectStrategy({
  authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
  tokenURL: 'https://www.googleapis.com/oauth2/v3/token',
  userInfoURL: 'https://www.googleapis.com/plus/v1/people/me/openIdConnect',
  clientID: process.env.OPENID_CLIENT_ID,
  clientSecret: process.env.OPENID_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  revocationURL: 'https://accounts.google.com/o/oauth2/revoke',
  tokenInfoURL: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
  oidcIssuer: 'accounts.google.com'
},
function(iss, sub, profile, accessToken, refreshToken, done) {
  models.User.findOne({
    where: {
      profileId: profile.id
    }
  }).then(function(user) {
    if (!user) {
      models.User.create({
        profileId: profile.id,
        name: profile.name.toString()
      }).then(function(user) {
        done(null, user);
      });
    }
  }).catch(function(err) {
    done(err);
  });
}));

app.set('views', './views');  
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
  secure: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('openidconnect'));
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.get('/auth/google/callback', passport.authenticate('openidconnect', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/health', function (req, res) {
  res.end();
});

app.all('*', function (req, res, next) {
  if (process.env.NODE_ENV != 'test' && !req.isAuthenticated()) {
    res.sendStatus(401);
  } else {
    next();
  }
});

app.use('/crossovers', crossoverRouter);

app.get('/*', function (req, res) {
  Router.run(routes, req.url, Handler => {
    let content = React.renderToString(<Handler />);
    res.render('index', { content: content });
  });
});

app.use((err, req, res, next) => {
  error(err);

  console.log(err);

  res.status(500);
  res.send(err);
});

module.exports = app;