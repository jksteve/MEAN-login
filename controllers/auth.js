const { response, request } = require( 'express' );
const { validationResult } = require( 'express-validator' );
const bcrypt = require( 'bcryptjs' );

const User = require( '../models/User.js' );
const { generateJWT } = require( '../helpers/jwt.js' );

const createUser = async ( req = request, res = response ) => {

    const { email, name, password } = req.body;

    try {

        // 1. verificar el email, que no exista
        const user = await User.findOne( { email } );

        if ( user ) {
            return res.status( 400 ).json( {
                ok: false,
                msg: 'User already exists with this email'
            } );
        }

        //2.Crear usuario con nuestro modelo
        const dbUser = new User( req.body );

        //3.Hashear la contrasena
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        //4.Generar el JWT => se le envia a angular como metodo de autenticacion pasiva
        const token = await generateJWT( dbUser.id, name );

        //5.crear usuario de DB
        await dbUser.save();

        //6.generar respuesta exitosa
        return res.status( 201 ).json( {
            ok: true,
            id: dbUser.id,
            name,
            email: dbUser.email,
            token
        } );


    } catch ( error ) {
        console.log( error );
        return res.status( 500 ).json( {
            ok: false,
            msg: 'Please contact your administrator'
        } );
    }
};

const login = async ( req = request, res = response ) => {


    const { email, password } = req.body;

    try {

        const dbUser = await User.findOne( { email } );

        if ( !dbUser ) {
            return res.status( 400 ).json( {
                ok: false,
                msg: "Email does not exist"
            } );
        }

        //Confirmar si el password hace match
        const validPassowrd = bcrypt.compareSync( password, dbUser.password );
        if ( !validPassowrd ) {
            return res.status( 400 ).json( {
                ok: false,
                msg: "Password does not match"
            } );
        }

        //tenemos un ususario y contrase;a hasta aqui, Generar un JWT
        const token = await generateJWT( dbUser.id, dbUser.name );

        //respuesta del servicio
        return res.json( {
            ok: true,
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        } );

    } catch ( error ) {
        console.log( error );
        return res.status( 500 ).json( {
            ok: false,
            msg: 'Please get in contact with the administrator'
        } );
    }

};

const renewToken = async ( req, res = response ) => {
    const { uid } = req;

    const dbUser = await User.findById( uid );

    const token = await generateJWT( uid, dbUser.name );

    return res.json( {
        ok: true,
        id: uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    } );

};

module.exports = {
    createUser,
    login,
    renewToken
};

