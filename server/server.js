const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

// Require database connection and models
const { mongoose } = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
const { authenticate } = require('./middleware/authenticate');

// Use a middleware to parse the body of the request and response
app.use(bodyParser.json());

// GET /
app.get('/', (request, response) => {
    return response.send({
        message: 'Todo app v1'
    });
});

// * TODOS routes

// CRUD Operations:
// Create Read Update Delete

// POST /todos. Create all todos.
app.post('/todos', authenticate, (request, response) => {
    console.log('Request body', request.body);
    const todo = new Todo({
        ...(request.body),
        creator: request.user._id
    });
    todo.save().then((res) => {
        response.send(res);
    }, (err) => {
        response.status(400).send(err);
    });
});

// GET /todos/:id Get todo by it's unique identifier (id).
app.get('/todos/:id', authenticate, (request, response) => {
    console.log('Fetching todo');
    const routeParams = request.params;
    const todoId = routeParams.id;
    if (!ObjectID.isValid(todoId)) {
        return response.status(400).send();
    }
    // Solucion Omar (funciona)
    /* Todo.findById(todoId).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }
        const userMakingRequestId = request.user.id;
        console.log({userMakingRequestId});
        const creatorId = todo.creator;
        console.log({creatorId});
        if (userMakingRequestId != creatorId) {
            return response.status(401).send();
        }
        response.send(todo);
    }, (err) => {
        response.status(400).send(err);
    });  */

    // Mas eficientemente
    const filter = {
        _id: todoId,
        creator: request.user.id
    };
    console.log({filter});
    Todo.findOne(filter).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }
        response.send(todo);
    }, (err) => {
        response.status(400).send(err);
    });
});

// TODO: TAREA
// 1. Secure GET /todos route (make todos accesible only by their owners with server authorization)
// BONUS:
// 2. Secure PATCH /todos/:id route (make todos accesible only by their owners with server authorization)
// 3. Secure DELETE /todos/:id route (make todos accesible only by their owners with server authorization)

// GET /todos. Get all the todos.
app.get('/todos', authenticate, (request, response) => {
    // Create filter for fetching todos belonging to the user making the request
    const filter = {
        creator: request.user.id
    };
    Todo.find(filter).then((todos) => {
        if (todos.length <= 0) {
            return response.send({ message: 'You have no todos' });
        }
        response.send({todos});
    }, (err) => {
        response.status(400).send(err);
    }); 
});

// PATCH /todos/:id Update todo.
app.patch('/todos/:id', authenticate, (request, response) => {
    const routeParams = request.params;
    const todoId = routeParams.id;
    const userId = request.user.id;
    if (!ObjectID.isValid(todoId)) {
        return response.status(400).send();
    }
    Todo.findById(todoId).then((todo) => {
        if (todo.creator != userId) {
            return response.status(401).send();
        }
        const filter = {
            creator: userId,
            _id: todoId
        };
        console.log({filter});
        Todo.findOneAndUpdate(
            filter,
            request.body,
            { new: true }
        ).then((res) => {
            response.send(res);
        }).catch((err) => {
            // Send back an internal server error
            response.status(500).send(err);
        });
    }).catch(error => {
        console.log(error);
        // Send back a bad request status
        response.status(400).send({errorMessage: error});
    });
});

// DELETE /todos/:id Delete todo.
app.delete('/todos/:id', authenticate, (request, response) => {
    const routeParams = request.params;
    const todoId = routeParams.id;
    const userId = request.user.id;
    if (!ObjectID.isValid(todoId)) {
        return response.status(400).send();
    }
    Todo.findById(todoId).then((todo) => {
        if (todo.creator != userId) {
            return response.status(401).send();
        }
        const filter = {
            creator: userId,
            _id: todoId
        };
        console.log({filter});
        Todo.remove(
            filter
        ).then((res) => {
            // res:
            // {
            //    "n": 1,
            //    "ok": 1
            // }
            console.log({res});
            if (res.result.n >= 1) {
                return response.send(todo);    
            }
            const error = 'An error ocurred';
            console.log(error);
            return response.status(500).send({errorMessage: error});
        }).catch((err) => {
            // Send back an internal server error
            response.status(500).send(err);
        });
    }).catch(error => {
        console.log(error);
        // Send back a bad request status
        response.status(400).send({errorMessage: error});
    });
});

// * USERS routes

// POST /users
app.post('/users', (request, response) => {
    console.log('Request body: ', request.body);
    const body = _.pick(request.body, ['email', 'password']);
    const user = new User(body);
    user.save().then((user) => {
        console.log('Saved new user', user.toJSON());
        response.send(user);
    }, (dbError) => {
        console.log('Error saving new user', dbError);
        response.status(400).send(dbError);
    });
});

// POST /users/login
// Every time a user logs in a new token will be generated for that user.
app.post('/users/login', (request, response) => {
    const credentials = _.pick(request.body, ['email', 'password']);
    User.findByCredentials(credentials.email, credentials.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            console.log('Token', token);
            response.header('Authorization', token).send(user);
        });
    }).catch((error) => {
        // Return bad request response
        response.status(400).send();
    });
});

// GET /users/me
app.get('/users/me', authenticate, (request, response) => {
    const user = request.user;
    response.send(user.toJSON());
});

// DELETE /users/me/token (logout)
app.delete('/users/me/token', authenticate, (request, response) => {
    const user = request.user;
    const token = request.token;
    user.removeToken(token).then(() => {
        // Return no content status: 204
        response.status(204).send();
    }).catch((error) => {
        console.log(error);
    });

});


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

// Export the app
module.exports = {
    app,
    Todo,
    User
};
