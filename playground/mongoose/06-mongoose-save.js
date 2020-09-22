const mongoose = require('mongoose');

// Set mongoose to use promises
mongoose.Promise = global.Promise;

const HOST = '127.0.0.1:27017';
const DATABASE = 'TodoApp';

// Set up connection
mongoose.connect(`mongodb://${HOST}/${DATABASE}`);

// Create a mongoose model with validation
const Todo = mongoose.model('Todo', {
    title: {
        type: String,
        require: true,
        // Validation. See all validations here: http://mongoosejs.com/docs/validation.html
        minlength: 1,
        trim: true
    },
    text: {
        type: String,
        minlength: 1,
        trim: true
    },
    category: {
        type: String,
        default: 'Uncategorized'
    },
    priority: {
        type: Number,
        default: 1,
        validate: {
            validator: function(value) {
                if (1 <= value && value <= 5) {
                    return undefined;
                } else {
                    throw new Error('Priority must be a value greater or equal to 1 and smaller or equal to 5');
                }
            },
            message: props => `${props.value} is not a valid priority!`
        },
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});

// Create a new todo
const newTodo = new Todo({
    title: 'Some title',
    text: 'Some text',
    category: 'Home',
    priority: 5
});

// Save the new todo
newTodo.save().then((res) => {
    console.log('Saved todo:', res);
}, (err) => {
    console.log('Unable to save todo', err);
});

const User = mongoose.model('User', {
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    name: {
        type: String,
        require: true,
        trim: true,
        minlength: 1
    }
});

const user = new User({
    email: '    bmondragonbrozon@gmail.com     ',
    name: 'Bernardo Mondragon Brozon'
});

user.save().then((res) => {
    console.log('Saved user: ', res);
}, (err) => {
    console.log('Unable to save user', err);
});
