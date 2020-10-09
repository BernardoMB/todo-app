const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const HOST = 'localhost:27017';
const DATABASE = 'TodoApp';
const connectionString = process.env.MONGODB_URI || `mongodb://${HOST}/${DATABASE}`;
mongoose.connect(connectionString);
module.exports = {mongoose};