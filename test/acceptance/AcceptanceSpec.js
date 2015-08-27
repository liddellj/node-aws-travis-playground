import chai from 'chai';
import request from 'supertest';
import app from '../../src/server';
const should = chai.should();

describe('My Acceptance Test', function() {
  it('should return 200', function(done) {
    request(app)
      .get('/dynamodb')
      .expect(function(res) {
        res.body.should.eql({ id: 666, name: 'Garfield' });
      })
      .expect(200, done);
  });
});