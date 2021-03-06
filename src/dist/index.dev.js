"use strict";

var express = require('express');

var morgan = require('morgan');

var path = require('path');

var app = express(); /////////////
////////////

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // routes

app.use(require('./routes')); // static file

app.use(express["static"](path.join(__dirname, 'public'))); // iniciar servidor

app.listen(app.get('port'), function () {
  console.log('servidor iniciado en el puerto ' + app.get('port'));
});