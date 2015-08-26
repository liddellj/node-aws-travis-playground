import chai from 'chai';
import request from 'request';
import app from '../../src/server';
const should = chai.should();

describe('My Acceptance Test', function() {
  let server;

  beforeEach(function() {
    server = app.listen(3000);
  });

  it('should return 200', function(done) {
    request.get('http://localhost:3000/dynamodb', function (err, res, body) {
      if (err) {
        console.log(err, err.stack);
      } else {
        res.statusCode.should.equal(200);
        JSON.parse(res.body).should.eql({ id: 666, name: 'Garfield' });
      }

      done();
    });
  });

  afterEach(function() {
    server.close();
  });
});