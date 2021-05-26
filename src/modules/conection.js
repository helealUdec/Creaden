const mysql = require('mysql')
const conection = mysql.createConnection({
     host: 'sql3.freesqldatabase.com',
     user: 'sql3415097',
     password: '1n22kUKMzT',
     database: 'sql3415097'
})

conection.connect((err) => {
     if (err) console.log(err) 
     console.log('la conexion funciona')
})

module.exports = conection;