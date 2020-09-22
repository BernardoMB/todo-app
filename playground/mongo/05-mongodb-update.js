const { MongoClient, ObjectID } = require('mongodb');

const HOST = 'localhost:27017';
const DATABASE = 'TodoApp';

MongoClient.connect(`mongodb://${HOST}/${DATABASE}`, (error, db) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    const todosCollection = db.collection('Todos');

    // findOneAndUpdate. Update the first element that matches the query
    todosCollection.findOneAndUpdate({
        // Mathcing criterea. (filter by _id)
        _id: new ObjectID('5f4eea40c26e11a727981c0c')
    }, {
        // Operations to perform to the matched document
        // For operators visit https://docs.mongodb.com/manual/reference/operator/
        $set: { completed: false } 
    }, {
        // Options
        // For more options visit http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#findOneAndUpdate
        returnOriginal: false // This give us the updated document.
    }).then((res) => {
        console.log('Updated todo: ', res);
    }, (err) => {
        console.log('Unable to update document', err);
    });

    // TODO: TAREA
    // 1. Encontrar un usuario por nombre y actualizar (Hint: findOneAndUpdate)
    // 2. Cambiar el nombre a 'Sin nombre'
    // 3. Vas a incrementar su edad en una unidad (Hint: Usar el operador $inc)
    // 4. Que la query regrese el documento actualizado
    // 5. Imprimir el resultado al usuario (Hint: utilizar .then(...))

    const usersCollection = db.collection('Users');
    // 1.
    usersCollection.findOneAndUpdate({ 
        name: 'Bernardo Mondragon' 
    }, {
        // 2.
        $set: {
            name: 'Sin nombre'
        },
        // 3.
        $inc: { age: 1 }
    }, {
        // 4.
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    }, (err) => {
        console.log(err);
    });

    db.close();
});