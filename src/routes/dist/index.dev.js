"use strict";

var express = require('express');

var conection = require('../modules/conection.js');

var path = require('path');

var router = express.Router();
router.use(express.json());
router.use(express.urlencoded({
  extended: true
})); //// multerrr

var multer = require('multer');

var mimeTypes = require('mime-types');

var ruta = path.join(__dirname, "public/files");
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, './src/public/files');
  },
  filename: function filename(req, file, cb) {
    var fecha = new Date();
    cb(null, req.body.userName + '-' + fecha.getDate() + fecha.getMonth() + fecha.getMinutes() + fecha.getMilliseconds() + '.' + mimeTypes.extension(file.mimetype));
  }
});
var upload = multer({
  storage: storage
}); //routes
//  inicio de sesion

router.get('/', function (req, res) {
  res.render('./index', {
    inicio: false,
    cancel: false
  });
});
router.post('/', function (req, res) {
  var info = req.body;
  var password = encodeBase64(info['userPassword']);
  conection.query("select * from userLogin where userName = '".concat(info['userName'], "'"), function (error, datos) {
    try {
      if (error) res.render('./index', {
        inicio: false,
        cancel: true
      });

      if (datos != null) {
        if (datos[0].userPassword == password) {
          res.redirect('/userspace' + "".concat(info['userName']));
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
  var password = encodeBase64(info['userPassword']);
  conection.query('select * from userLogin', function (err, datos) {
    if (!comprobarExiste(datos, info)) {
      conection.query("insert into userLogin (userName, userPassword) values ('".concat(info['userName'], "', '").concat(password, "')"));
      conection.query("create table ".concat(info['userName'], "Data (\n                id int auto_increment,\n                userName varchar(30),\n                datePost datetime,\n                textPost varchar(500),\n                imageUrl varchar(500), \n                primary key (id)\n           );"));
      res.render('./register', {
        registro: true
      });
    }
  });
}); // espacio de cada usuario

router.get('/userspace:userName', function (req, res) {
  var userName = req.params.userName; // envio las publicaciones del usuario

  conection.query("select * from  ".concat(userName, "Data"), function (error, data) {
    var n = data.length;
    var arreglo = [];

    for (var i = 0; i < n; i++) {
      var imageUrl = void 0;
      if (data[i].imageUrl == null) imageUrl = "vacio12Se";else imageUrl = data[i].imageUrl;
      arreglo[i] = [data[i].id, data[i].userName, data[i].datePost, data[i].textPost, imageUrl];
    }

    for (var _i = 0; _i < arreglo.length; _i++) {
      for (var j = 0; j < arreglo[_i].length; j++) {
        arreglo[_i][j] += "des4523";
      }
    }

    res.render('userspace.ejs', {
      datos: arreglo,
      userName: userName
    });
  });
});
router.post('/userspace:userName', upload.any(), function (req, res) {
  var userName = req.body.userName;
  var text = req.body.text;
  var date = req.body.date;
  var deletePost = req.body["delete"];
  var imagePost;
  if (req.files[0]) imagePost = req.files[0].filename;

  if (text && imagePost) {
    conection.query("insert into ".concat(userName, "Data (userName, datePost, textPost, imageUrl) values (\"").concat(userName, "\", \"").concat(date, "\", \"").concat(text, "\", \"").concat(imagePost, "\")"), function (error) {
      if (error) console.log(error);
    });
  } else if (text) {
    conection.query("insert into ".concat(userName, "Data (userName, datePost, textPost) values (\"").concat(userName, "\", \"").concat(date, "\", \"").concat(text, "\")"), function (error) {
      if (error) console.log(error);
    });
  } else if (imagePost) {
    conection.query("insert into ".concat(userName, "Data (userName, datePost, imageUrl) values (\"").concat(userName, "\", \"").concat(date, "\", \"").concat(imagePost, "\")"), function (error) {
      if (error) console.log(error);
    });
  }

  if (deletePost) {
    conection.query("delete from ".concat(userName, "Data where id = ").concat(deletePost), function (error) {
      if (error) console.log(error);
    });
  }

  conection.query("select * from  ".concat(userName, "Data"), function (error, data) {
    var n = data.length;
    var arreglo = [];

    for (var i = 0; i < n; i++) {
      var imageUrl = void 0;
      var texto = void 0;
      if (data[i].imageUrl == null) imageUrl = "vacio12Se";else imageUrl = data[i].imageUrl;
      if (data[i].textPost == null) texto = "vacio12Se";else texto = data[i].textPost;
      arreglo[i] = [data[i].id, data[i].userName, data[i].datePost, texto, imageUrl];
    }

    for (var _i2 = 0; _i2 < arreglo.length; _i2++) {
      for (var j = 0; j < arreglo[_i2].length; j++) {
        arreglo[_i2][j] += "des4523";
      }
    }

    res.render('userspace.ejs', {
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
/**
 * Función que codifica un texto plano a base64
 * @param textoPlano
 * @returns {string}
 */


function encodeBase64(textoPlano) {
  var base64s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  textoPlano = escape(textoPlano);
  var bits,
      dual,
      i = 0,
      encOut = '';

  while (textoPlano.length >= i + 3) {
    bits = (textoPlano.charCodeAt(i++) & 0xff) << 16 | (textoPlano.charCodeAt(i++) & 0xff) << 8 | textoPlano.charCodeAt(i++) & 0xff;
    encOut += base64s.charAt((bits & 0x00fc0000) >> 18) + base64s.charAt((bits & 0x0003f000) >> 12) + base64s.charAt((bits & 0x00000fc0) >> 6) + base64s.charAt(bits & 0x0000003f);
  }

  if (textoPlano.length - i > 0 && textoPlano.length - i < 3) {
    dual = Boolean(textoPlano.length - i - 1);
    bits = (textoPlano.charCodeAt(i++) & 0xff) << 16 | (dual ? (textoPlano.charCodeAt(i) & 0xff) << 8 : 0);
    encOut += base64s.charAt((bits & 0x00fc0000) >> 18) + base64s.charAt((bits & 0x0003f000) >> 12) + (dual ? base64s.charAt((bits & 0x00000fc0) >> 6) : '=') + '=';
  }

  return encOut;
}