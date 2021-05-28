"use strict";

var mysql = require('mysql');

var conection = mysql.createConnection({
  host: 'db4free.net',
  user: 'harryfora',
  password: 'maki12tevaca',
  database: 'creadendb'
});
conection.connect(function (err) {
  if (err) console.log(err);
  console.log('la conexion funciona');
});
module.exports = conection;