const express = require( 'express' );
const cors = require( 'cors' );
const { dbConection } = require( './DB/config.js' );
require( 'dotenv' ).config();
const path = require( 'path' );

//Crear el servidor/aplicacion de express
const app = express();

//conexion a base de datos
dbConection();

//drectorio publico
app.use( express.static( 'public' ) );

//cors
app.use( cors() );

//lectura y parseo del middelware
app.use( express.json() );

//Rutas
app.use( '/api/auth', require( './routes/auth' ) );

app.get( '*', ( req, res ) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
} );

app.listen( process.env.PORT, () => {
    console.log( `Servidor corriendo en el puerto ${ process.env.PORT }` );
} );