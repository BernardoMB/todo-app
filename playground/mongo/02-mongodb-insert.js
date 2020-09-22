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

    db.collection('Todos').insertOne({
        title: 'Courses sections',
        text: 'Lessons should be arranged inside course sections as if they were modules',
        category: 'Development',
        priority: 5,
        createdAt: new Date(),
        updatedAt: new Date()
    }, (error, result) => {
        // Handle error
        if (error) {
            console.log('Unable to insert document', error);
            throw error;
        }
        // Print the document that was inserted
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.collection('Users').insertOne({
        name: 'Bernardo Mondragon',
        age: 26,
        likes: [
            'football',
            'math',
            'actuary'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    }, (error, result) => {
        // Handle error
        if (error) {
            console.log('Unable to insert document', error);
            throw error;
        }
        // Print the document that was inserted
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.close();
});