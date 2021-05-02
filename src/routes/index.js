const Swal = require('sweetalert2');
const express = require('express');
const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');



const router = express.Router();
//routes

//  inicio de sesion
router.get('/', (req, res) => {
    res.render('./index', { inicio: false, cancel: false });
});

router.post('/', (req, res) => {
    try {
        let info = req.body;
        const conection = require('../modules/conection.js');
        conection.query(`select * from userLogin where userName = '${info['userName']}'`, (error, datos) => {
            if(error) throw error;
            else {
                if (datos != null) {
                    if (datos[0].userPassword == info['userPassword']) {
                        res.render('./index', { inicio: true, cancel: false });
                    } else {
                        res.render('./index', { inicio: false, cancel: true });
                    }

                }
            }
        });
    } catch (error) {
        res.render('./index', { inicio: false, cancel: true });
    }



});


// registro de las personas
router.get('/register', (req, res) => {
    res.render('register', { registro: false });
});


router.post('/register', (req, res) => {
    let info = req.body;
    const conection = require('../modules/conection.js');
    conection.query('select * from userLogin', (err, datos) => {
        if (!comprobarExiste(datos, info)) {
            conection.query(`insert into userLogin (userName, userPassword) values ('${info['userName']}', '${info['userPassword']}')`);
            conection.query(`create table ${info['userName']}Data (
                id int auto_increment,
                userName varchar(30),
                datePost datetime,
                textPost varchar(500),
                primary key (id)
           );`);
            res.render('./register', { registro: true });
        }
    });

});

// espacio de cada usuario
router.get('/userSpace', (req, res) => {
    res.render('userSpace');
});

module.exports = router;

// verificar si el nombre de usuario existe
function comprobarExiste(datos, info) {
    let n = datos.length;
    let userName = info['userName'];
    let duplicado = true;
    for (let i = 0; i < n; i++) {
        if (datos[i].userName == userName) {
            duplicado = true;
            break;
        } else duplicado = false;
    }
    return duplicado;
}