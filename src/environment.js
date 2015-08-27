/* eslint no-console: 0 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

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