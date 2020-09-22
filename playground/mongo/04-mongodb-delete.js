// Connect to the database
const MongoClient = require('mongodb').MongoClient;

const HOST = 'localhost:27017';
const DATABASE = 'TodoApp'; // If 'TodoApp' database does not exists, then the MongoDB server will create the database if and only if we try to write data.

// Connect
MongoClient.connect(`mongodb://${HOST}/${DATABASE}`, (error, db) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    const todosCollection = db.collection('Todos');

    // deleteMany. Delete all documents that match the specified filter
    /* todosCollection.deleteMany({
        title: 'Test'
    }).then((res) => {
        console.log(`Deleted ${res.deletedCount} todos`);
    }, (err) => {
        console.log('Unable to delete todos', err);
    }); */

    // deleteOne. Delete the first document that matche the filter in the query
    /* todosCollection.deleteOne({
        title: 'Test'
    }).then((res) => {
        console.log(`Deleted ${res.deletedCount} todos`);
    }, (err) => {
        console.log('Unable to delete todos', err);
    }); */

    // findOneAndDelete. Delete the first document that matches the filter in the query and return the deleted document
    todosCollection.findOneAndDelete({
        title: 'Test'
    }).then((res) => {
        console.log(`Deleted todo`, res.value);
    }, (err) => {
        console.log('Unable to delete todos', err);
    });

    db.close();
});