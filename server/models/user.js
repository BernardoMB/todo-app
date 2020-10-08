const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
mongoose.plugin(schema => { schema.options.usePushEach = true });

// The 'Schema' propperty  of 'mongoose' let us define a new shcema for the user model.
// We need the Schema propperty to define on the model-methods and the instance-methods.
// The Schema constructor takes an object which are going to be all the atributes of the user model.
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
        // The user has to be unique
        // Search in google: 'mongoose custom validaton' 
        validate: {
            validator: validator.isEmail,
            // Meesage in case email is invalid
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true,
            usePushEach: true
        },
        token: {
            type: String,
            required: true,
            usePushEach: true
        },
    }]
}, {
    usePushEach: true
});

// * INSTANCE METHODS:

// Tell mongoose what should send back when the user model is converted to a json object.
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}

// Generate token
UserSchema.methods.generateAuthToken = function() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'secret').toString();
    console.log('Payload', {
        access, token
    });
    user.tokens.push({
        access, token
    });
    return user.save().then(() => {
        return token;
    }, (err) => {
        console.log('Unable to store user token', err);
    });
}

// Remove token
UserSchema.methods.removeToken = function(token) {
    console.log('Token', token);
    const user = this;
    // Pass only query to update user. Update is applied to user (this).
    const mongoQuery = {
        // MongoDB operator '$pull' let us remove items from an array that match certain criterea.
        $pull: {
            // Define what we want to pull.
            tokens: { token }
        }
    };
    return user.update(mongoQuery);
}

// Hash the password before storing the user object (for security)
UserSchema.pre('save', function(next) {
    // Get access to the indidual document.
    var user = this;
    if (user.isModified('password')) {
        // Store user safely (with password or sensitive data hashed)
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// * MODEL METHODS:

// Find user by token
UserSchema.statics.findByToken = function(token) {
    const User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, 'secret');
    } catch(e) {
        console.log('Access denied for token', token);
        /* return new Promise((resolve, reject) => {
            reject(); // Access denied
        }); */
        // Alternatively
        return Promise.reject('Invalid auth token');
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.access': decoded.access,
        'tokens.token': token
    });
}

// Find by credentials
UserSchema.statics.findByCredentials = function(email, password) {
    const User = this;
    return User.findOne({email}).then((user) => {
        if (!user) {
            console.log('Invalid email');
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (error, result) => {
                if (result) {
                    resolve(user);
                } else {
                    console.log('Invalid password');
                    reject();
                }
            });
        });
    });
};

// Pass the user Schema into the model.
const User = mongoose.model('User', UserSchema);

module.exports = {User};