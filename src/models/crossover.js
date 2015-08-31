/* eslint no-cond-assign: 0 */
import dynamoose from 'dynamoose';

if (process.env.DYNAMODB_LOCAL_ENDPOINT){
  dynamoose.local(process.env.DYNAMODB_LOCAL_ENDPOINT);
}

/*{
  id: 123,
  filters: [{
    type: '??',
    gain: 0,
    ...parameters...
  }],
  driveUnits: [{
    key: 'Super Tweeter'
  }],
  changes: [{
    type: 'set-gain',
    gain: 1
  }]
}*/

var schema = new dynamoose.Schema({
  id: {
    type: Number,
    hashKey: true
  },
  /*name: {
    type: String,
    required: false
  },
  filters: {
    type: Array,
    required: false
  },
  driveUnits: {
    type: Array,
    required: false
  },*/
  changes: {
    type: Array,
    required: false,
    default: []
  },
  gain: {
    type: Number,
    required: false,
    default: 0
  }
});

schema.methods.publish = function() {
  let change;

  while (change = this.changes.shift()){
    this.applyChange(change);
  }
};

schema.methods.applyChange = function(change) {
  if (change.type == 'set-gain') {
    this.gain = change.gain;
  } else {
    throw new Error('Unrecognised change type.');
  }
};

module.exports = dynamoose.model('Crossover', schema);