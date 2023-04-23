const { Schema, model } = require( "mongoose" );



const UserSchema = Schema( {
    name: {
        type: String,
        requires: true
    },
    email: {
        type: String,
        requires: true,
        unique: true
    },
    password: {
        type: String,
        requires: true
    },
} );

module.exports = model( 'User', UserSchema );