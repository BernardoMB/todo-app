const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const HOST = 'localhost:27017';
const DATABASE = 'TodoApp';
mongoose.connect(`mongodb://${HOST}/${DATABASE}`);
module.exports = {mongoose};