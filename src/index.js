const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();


app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs' );


// routes
app.use(require('./routes'));

// static file
app.use(express.static(path.join(__dirname, 'public')));

// iniciar servidor
app.listen(app.get('port'), () => {
     console.log('servidor iniciado en el puerto ' + app.get('port'));
});
