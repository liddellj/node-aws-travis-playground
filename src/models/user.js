/* eslint no-cond-assign: 0 */
import dynamoose from 'dynamoose';

if (process.env.DYNAMODB_LOCAL_ENDPOINT){
  dynamoose.local(process.env.DYNAMODB_LOCAL_ENDPOINT);
}

var schema = new dynamoose.Schema({
  id: {
    type: Number,
    hashKey: true
  },
  name: {
    type: String,
    required: true
  }
});

module.exports = dynamoose.model('User', schema);