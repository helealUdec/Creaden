"use strict";

var Swal = require('sweetalert2');

var express = require('express');

var http = require('http');

var url = require('url');

var fs = require('fs');

var querystring = require('querystring');

var conection = require('../modules/conection.js');

var router = express.Router(); //routes
//  inicio de sesion

router.get('/', function (req, res) {
  res.render('./index', {
    inicio: false,
    cancel: false
  });
});
router.post('/', function (req, res) {
  var info = req.body;
  conection.query("select * from userLogin where userName = '".concat(info['userName'], "'"), function (error, datos) {
    try {
      if (error) res.render('./index', {
        inicio: false,
        cancel: true
      });

      if (datos != null) {
        if (datos[0].userPassword == info['userPassword']) {
          res.redirect('/userSpace' + "".concat(info['userName']));
        } else {
          res.render('./index', {
            inicio: false,
            cancel: true
          });
        }
      }
    } catch (errores) {
      console.log(errores);
      res.render('./index', {
        inicio: false,
        cancel: true
      });
    }
  });
}); // registro de las personas

router.get('/register', function (req, res) {
  res.render('./register', {
    registro: false
  });
});
router.post('/register', function (req, res) {
  var info = req.body;
  conection.query('select * from userLogin', function (err, datos) {
    if (!comprobarExiste(datos, info)) {
      conection.query("insert into userLogin (userName, userPassword) values ('".concat(info['userName'], "', '").concat(info['userPassword'], "')"));
      conection.query("create table ".concat(info['userName'], "Data (\n                id int auto_increment,\n                userName varchar(30),\n                datePost datetime,\n                textPost varchar(500),\n                primary key (id)\n           );"));
      res.render('./register', {
        registro: true
      });
    }
  });
}); // espacio de cada usuario

router.get('/userSpace:userName', function (req, res) {
  var userName = req.params.userName;
  console.log(userName);
  conection.query("select * from  ".concat(userName, "Data"), function (error, data) {
    var n = data.length;
    var arreglo = [];

    for (var i = 0; i < n; i++) {
      arreglo[i] = [data[i].userName, data[i].datePost, data[i].textPost];
    }

    res.render('userSpace.ejs', {
      datos: arreglo,
      userName: userName
    });
  });
});
router.post('/userSpace:userName', function (req, res) {
  var userName = req.body.userName;
  var text = req.body.text;
  var date = req.body.date;

  if (text) {
    conection.query("insert into ".concat(userName, "Data (userName, datePost, textPost) values (\"").concat(userName, "\", \"").concat(date, "\", \"").concat(text, "\")"), function (error) {
      if (error) console.log(error);
    });
  }

  conection.query("select * from  ".concat(userName, "Data"), function (error, data) {
    var n = data.length;
    var arreglo = [];

    for (var i = 0; i < n; i++) {
      arreglo[i] = [data[i].userName, data[i].datePost, data[i].textPost];
    }

    res.render('userSpace.ejs', {
      datos: arreglo,
      userName: userName
    });
  });
});
module.exports = router; // verificar si el nombre de usuario existe

function comprobarExiste(datos, info) {
  var n = datos.length;
  var userName = info['userName'];
  var duplicado = true;

  for (var i = 0; i < n; i++) {
    if (datos[i].userName == userName) {
      duplicado = true;
      break;
    } else duplicado = false;
  }

  return duplicado;
}