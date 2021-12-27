
const mongoose = require("mongoose");
const colors = require("colors");

const dbConnection = async()=>{
    
    try {

        await mongoose.connect( process.env.MONGODB_CNN )
        console.log("Base de datos mongoDB online".cyan)

    } catch (error) {
        console.log(error)
        throw new Error('Error en la base de datos')
    }
}

module.exports = {
    dbConnection
}
