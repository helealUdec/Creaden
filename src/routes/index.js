const Swal = require('sweetalert2');
const express = require('express');
const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const conection = require('../modules/conection.js');


const router = express.Router();

const  body_parser   = require('body-parser');
router.use(body_parser()); //Express 4
const multipart = require('connect-multiparty');
router.use(multipart()); //Express 4
//routes

//  inicio de sesion
router.get('/', (req, res) => {
    res.render('./index', { inicio: false, cancel: false });
});

router.post('/', (req, res) => {
    let info = req.body;
    conection.query(`select * from userLogin where userName = '${info['userName']}'`, (error, datos) => {
        try {
            if (error) res.render('./index', { inicio: false, cancel: true });
            if (datos != null) {
                if (datos[0].userPassword == info['userPassword']) {
                    res.redirect('/userspace' + `${info['userName']}`);
                } else {
                    res.render('./index', { inicio: false, cancel: true });
                }
            }
        } catch (errores) {
            console.log(errores);
        res.render('./index', { inicio: false, cancel: true });
    }

});

});

// registro de las personas
router.get('/register', (req, res) => {
    res.render('./register', { registro: false });
});

router.post('/register', (req, res) => {
    let info = req.body;
    conection.query('select * from userLogin', (err, datos) => {
        if (!comprobarExiste(datos, info)) {
            conection.query(`insert into userLogin (userName, userPassword) values ('${info['userName']}', '${info['userPassword']}')`);
            conection.query(`create table ${info['userName']}Data (
                id int auto_increment,
                userName varchar(30),
                datePost datetime,
                textPost varchar(500),
                imageUrl varchar(500), 
                primary key (id)
           );`);
            res.render('./register', { registro: true });
        }
    });


});

// espacio de cada usuario
router.get('/userspace:userName', (req, res) => {
    let userName = req.params.userName;

    console.log(userName);
    // envio las publicaciones del usuario
    conection.query(`select * from  ${userName}Data`, (error, data) => {
        let n = data.length;
        let arreglo = [];
        for (let i = 0; i < n; i++) {
            arreglo[i] = [
                data[i].id,
                data[i].userName,
                data[i].datePost,
                data[i].textPost
            ];
        } 

        res.render('userspace.ejs', { datos: arreglo, userName: userName });
    });

});



router.post('/userspace:userName', (req, res) => {
    let userName = req.body.userName;
    let text = req.body.text;
    let date = req.body.date;
    let deletePost = req.body.delete;
    let path = req.files;
    console.log(path);
    if (text) {
        conection.query(`insert into ${userName}Data (userName, datePost, textPost) values ("${userName}", "${date}", "${text}")`, (error) => {
            if (error) console.log(error);
        });
    }

    if(deletePost) {
        conection.query(`delete from ${userName}Data where id = ${deletePost}`, (error) => {
            if (error) console.log(error);
        });
    }


    conection.query(`select * from  ${userName}Data`, (error, data) => {
        let n = data.length;
        let arreglo = [];
        for (let i = 0; i < n; i++) {
            arreglo[i] = [
                data[i].id,
                data[i].userName,
                data[i].datePost,
                data[i].textPost
            ];
        }

        res.render('userspace.ejs', { datos: arreglo , userName: userName });
    });
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
