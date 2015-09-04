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
import User from './models/user';
import bodyParser from 'body-parser';

const app = express();
const error  = debug('server:error');
const log  = debug('server:log');
const OpenIdConnectStrategy = openidconnect.Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.get(id, function(err, user) {
    done(err, user);
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
  User.get(Number(profile.id), function(err, user) {
    if (!err && !user){
      user = new User({
        id: Number(profile.id),
        name: profile.name
      });

      user.save((err, model) => {
        if (err) {
          done(err);
        }

        done(err, model);
      });
    } else {
      done(err, user);
    }
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

app.all('*', function (req, res, next) {
  if (process.env.NODE_ENV != 'test' && !req.isAuthenticated()) {
    res.sendStatus(401);
  } else {
    next();
  }
});

app.use('/crossovers', crossoverRouter);

app.get('/health', function (req, res) {
  res.end();
});

app.get('/*', function (req, res) {
  Router.run(routes, req.url, Handler => {
    let content = React.renderToString(<Handler />);
    res.render('index', { content: content });
  });
});

app.use((err, req, res, next) => {
  error(err);

  res.status(500);
  res.send(err);
});

module.exports = app;