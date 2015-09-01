/* eslint no-unused-vars: 0 */

import debug from 'debug';
import express from 'express';
import Crossover from '../models/crossover';
import bodyParser from 'body-parser';

const router = express.Router();
const error  = debug('server:error');

router.use(bodyParser.json());

router.post('/', (req, res, next) => {
  error(1);
  let crossover = new Crossover(req.body);

  crossover.save((err, model) => {
    error(2);
    if (err) {
      error(3);
      error(err);
      next(err);
    } else {
      error(4);
      error(model);
      res.send(model);
    }
  });
});

router.get('/:id', function (req, res, next) {
  Crossover.get(Number(req.params.id), (err, model) => {
    if (err){
      next(err);
    } else {
      res.send(model);
    }
  });
});

router.post('/:id/changes', (req, res, next) => {
  Crossover.get(Number(req.params.id), (err, model) => {
    if (err){
      next(err);
    } else {
      model.changes.push(req.body);
      model.save((err, m) => {
        res.sendStatus(200);
      });
    }
  });
});

router.post('/:id/publish', (req, res, next) => {
  Crossover.get(Number(req.params.id), (err, model) => {
    if (err){
      next(err);
    } else {
      model.publish();
      model.save((err, m) => {
        res.send(m);
      });
    }
  });
});

module.exports = router;