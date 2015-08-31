/* eslint no-unused-vars: 0 */

import express from 'express';
import Crossover from '../models/crossover';
import bodyParser from 'body-parser';
const router = express.Router();

router.use(bodyParser.json());

router.post('/', (req, res, next) => {
  let crossover = new Crossover(req.body);

  crossover.save((err, model) => {
    if (err){
      next(err);
    } else {
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