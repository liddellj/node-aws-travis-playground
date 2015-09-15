/* eslint no-unused-vars: 0 no-console: 0 */

import express from 'express';
import models from '../models';
import bodyParser from 'body-parser';

const router = express.Router();

router.use(bodyParser.json());

router.post('/', (req, res, next) => {
  models.Crossover
    .create(req.body)
    .then((crossover) => {
      res.send(crossover);
    }).catch((err) => {
      next(err);
    });
});

router.get('/:id', function (req, res, next) {
  models.Crossover
    .findById(Number(req.params.id))
    .then((crossover) => {
      res.send(crossover);
    }).catch((err) => {
      next(err);
    });
});

router.post('/:id/changes', (req, res, next) => {
  models.Crossover
    .findById(Number(req.params.id))
    .then((crossover) => {
      crossover.changes.push(req.body);
      crossover.changed('changes', true);
      crossover
        .save()
        .then((m) => {
          res.send(m);
        }).catch((err) => {
          next(err);
        });
    }).catch((err) => {
      next(err);
    });
});

router.post('/:id/publish', (req, res, next) => {
  models.Crossover.findById(Number(req.params.id))
    .then((crossover) => {
      crossover.publish();
      crossover
        .save()
        .then((m) => {
          res.send(m);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;