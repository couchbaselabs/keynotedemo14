////===================================

var express = require('express');
var app = express();
var path = require('path');
var auth = require('./engine/auth.js');
var cookie = require('cookie-parser');

////===================================

////===================================

app.use(cookie());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');
require('./routes/routes.js')(app);

////===================================

app.listen(3001);
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
