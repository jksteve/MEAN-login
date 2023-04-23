

const { Router } = require( 'express' );
const { createUser, login, renewToken } = require( '../controllers/auth.js' );
const { check } = require( 'express-validator' );
const { validarCampos } = require( '../middlewares/validar-campos.js' );
const { validateJWT } = require( '../middlewares/validar-JWT.js' );

const router = Router();

//Crear un nuevo usuario
router.post( '/new', [
    check( 'name', 'The name is mandatory' ).not().isEmpty(),
    check( 'email', 'The email is mandatory and must be a valid email' ).isEmail(),
    check( 'password', 'The password is mandatory and must be more than 6 characters' ).isLength( 6 ),
    validarCampos
], createUser );

//Login de usuario
router.post( '/', [
    check( 'email', 'The email is mandatory and must be a valid email' ).isEmail(),
    check( 'password', 'The password is mandatory and must be more than 6 characters' ).isLength( 6 ),
    validarCampos
], login );

//Validar y revalidad token
router.get( '/renew', [
    validateJWT
], renewToken );

module.exports = router;