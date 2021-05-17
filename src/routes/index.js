const express = require('express');
const conection = require('../modules/conection.js');
const path = require('path');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//// multerrr


const multer = require('multer');
const mimeTypes = require('mime-types');
let ruta = path.join(__dirname, "public/files")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/files')
    },
    filename: function (req, file, cb) {

        let fecha = new Date();
        cb(null, req.body.userName + '-' + fecha.getDate() + fecha.getMonth() + fecha.getMinutes() + fecha.getMilliseconds() + '.' + mimeTypes.extension(file.mimetype));
    }
});
const upload = multer({
    storage: storage
});


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

    // envio las publicaciones del usuario
    conection.query(`select * from  ${userName}Data`, (error, data) => {
        let n = data.length;
        let arreglo = [];
        for (let i = 0; i < n; i++) {
            let imageUrl;
            if (data[i].imageUrl == null) imageUrl = "vacio";
            else imageUrl = data[i].imageUrl;
            arreglo[i] = [
                data[i].id,
                data[i].userName,
                data[i].datePost,
                data[i].textPost,
                imageUrl
            ];
        }

        res.render('userspace.ejs', { datos: arreglo, userName: userName });
    });

});




router.post('/userspace:userName', upload.any(), (req, res) => {
    let userName = req.body.userName;
    let text = req.body.text;
    let date = req.body.date;
    let deletePost = req.body.delete;
    let imagePost;

    if (req.files[0]) imagePost = req.files[0].filename;

    if (text && imagePost) {
        conection.query(`insert into ${userName}Data (userName, datePost, textPost, imageUrl) values ("${userName}", "${date}", "${text}", "${imagePost}")`, (error) => {
            if (error) console.log(error);
        });
    } else if (text) {
        conection.query(`insert into ${userName}Data (userName, datePost, textPost) values ("${userName}", "${date}", "${text}")`, (error) => {
            if (error) console.log(error);
        });
    } else if (imagePost) {
        conection.query(`insert into ${userName}Data (userName, datePost, imageUrl) values ("${userName}", "${date}", "${imagePost}")`, (error) => {
            if (error) console.log(error);
        });
    }

    if (deletePost) {
        conection.query(`delete from ${userName}Data where id = ${deletePost}`, (error) => {
            if (error) console.log(error);
        });
    }

    conection.query(`select * from  ${userName}Data`, (error, data) => {
        let n = data.length;
        let arreglo = [];
        for (let i = 0; i < n; i++) {
            let imageUrl;
            let texto;
            if (data[i].imageUrl == null) imageUrl = "vacio12Se";
            else imageUrl = data[i].imageUrl;

            if (data[i].textPost == null) texto = "vacio12Se";
            else texto = data[i].textPost;
            arreglo[i] = [
                data[i].id,
                data[i].userName,
                data[i].datePost,
                texto,
                imageUrl
            ];
        }

        res.render('userspace.ejs', { datos: arreglo, userName: userName });
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
