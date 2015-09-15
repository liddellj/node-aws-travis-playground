import chai from 'chai';
import supertest from 'supertest';
import app from '../../src/server';
import models from '../../src/models';
const should = chai.should();

describe('My Acceptance Test', function() {
  let request;

  before(function() {
    request = supertest(app);

    models.sequelize.sync({ force: true });
  });

  it('should be able to create a crossover', function(done) {
    request
      .post('/crossovers')
      .send({ id: 101 })
      .expect(200)
      .expect({ id: 101, changes: [], gain: 0 }, done);
  });

  it('should be able to get a crossover', function(done) {
    request
      .post('/crossovers')
      .send({ id: 102 })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        request
          .get('/crossovers/102')
          .expect({ id: 102, changes: [], gain: 0 }, done);
      });
  });

  it('should be able to post a change', function(done) {
    request
      .post('/crossovers')
      .send({ id: 103 })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        request
          .post('/crossovers/103/changes')
          .send({ type: 'set-gain', gain: 1 })
          .expect({ id: 103, changes: [{ type: 'set-gain', gain: 1 }], gain: 0 }, done);
      });
  });

  it('should be able to publish changes', function(done) {
    request
      .post('/crossovers')
      .send({ id: 104 })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        request
          .post('/crossovers/104/changes')
          .send({ type: 'set-gain', gain: 1 })
          .expect({ id: 104, changes: [{ type: 'set-gain', gain: 1 }], gain: 0 })
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            request
              .post('/crossovers/104/publish')
              .expect({ id: 104, changes: [], gain: 1 }, done);
          });
      });
  });
});