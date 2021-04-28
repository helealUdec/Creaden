const express = require('express');
const router = express.Router();
//routes
router.get('/', (req, res) => {
     res.render('index');
});

// router.get('/contact', (req, res) => {
//      res.render('contact.html', {tittle: 'Hola bro'});
// });

module.exports = router;