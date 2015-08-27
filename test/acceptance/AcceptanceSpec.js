import chai from 'chai';
import supertest from 'supertest';
import app from '../../src/server';
const should = chai.should();

describe('My Acceptance Test', function() {
  let request;

  before(function() {
    request = supertest(app);
  });

  it('should return 200', function(done) {
    request
      .get('/dynamodb')
      .expect(200, { id: 666, name: 'Garfield' }, done);
  });
});