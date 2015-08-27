import dynamoose from 'dynamoose';

if (process.env.DYNAMODB_LOCAL_ENDPOINT){
  dynamoose.local(process.env.DYNAMODB_LOCAL_ENDPOINT);
}

module.exports = dynamoose.model('Cat', { id: Number, name: String });