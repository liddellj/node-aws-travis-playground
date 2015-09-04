/* eslint no-console: 0 */

import app from './server';

var server = app.listen(3000, function () {  
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});