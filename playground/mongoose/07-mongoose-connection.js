// TODO: TAREA
// 1. hacer require a mongoose
const mongoose = require('mongoose');

// 2. Decirle a mongoose que utilizaremos promesas
mongoose.Promise = global.Promise;

// 3. crear la coneccion a la base de datos
const HOST = 'localhost:27017';
const DATABASE = 'TodoApp';

mongoose.connect(`mongodb://${HOST}/${DATABASE}`);

// 4. exportar la base datos de manera que 07-mongoose-connection.js sea un module
module.exports = {
    mongoose
};