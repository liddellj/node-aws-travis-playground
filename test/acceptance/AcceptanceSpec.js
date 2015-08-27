import chai from 'chai';
import supertest from 'supertest';
import app from '../../src/server';
import dynamoose from 'dynamoose';
const should = chai.should();

describe('My Acceptance Test', function() {
  let request;

  before(function() {
    request = supertest(app);

    delete dynamoose.models.Cat;
  });

  it('should return 200', function(done) {
    request
      .get('/dynamodb')
      .expect(200, done);
  });

  it('should return correct body', function(done) {
    request
      .get('/dynamodb')
      .expect({ id: 666, name: 'Garfield' }, done);
  });
});