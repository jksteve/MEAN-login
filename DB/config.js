const mongoose = require( "mongoose" );



const dbConection = async () => {

    try {

        await mongoose.connect( process.env.DB_CONNECTION );

        console.log( 'DB online' );

    } catch ( error ) {
        console.log( error );
        throw new Error( 'Error when starting Data Base' );
    }

};

module.exports = {
    dbConection
};