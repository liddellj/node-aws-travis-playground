/* eslint no-console: 0 */

var fs = require('fs');
var path = require('path');
var dotenv = require('dotenv');

module.exports = function() {

  dotenv.load();

  var missing = fs.readFileSync(path.resolve(__dirname, '..', '.env.example'), 'utf-8')
    .match(/^(\w+)/gm)
    .filter(function(varrr) {
      return !process.env[varrr];
    });

  if (missing.length) {
    console.error('\nMissing: ' + missing.join(', '));
    console.error('Please update your .env');
    process.exit(1);
  }
};