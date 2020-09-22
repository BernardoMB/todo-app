const mongoose = require('mongoose');
const Todo = mongoose.model('Todo', {
    title: {
        type: String,
        required: true,
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
module.exports = {Todo};