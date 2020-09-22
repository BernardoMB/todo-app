const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const HOST = 'localhost:27017';
const DATABASE = 'TodoApp';
mongoose.connect(`mongodb://nodejs-todo-app:rYDpM62XQ4orlDlLOst8aNOK655jm578o75Slt4E4EQtckMkeRKfw6hAz1M5AzJIMFYkXiaPLIJHow5fYz2IBg%3D%3D@nodejs-todo-app.mongo.cosmos.azure.com:10255/?ssl=true&appName=@nodejs-todo-app@`);
module.exports = {mongoose};