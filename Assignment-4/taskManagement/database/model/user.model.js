// user.model.js

// Import necessary modules
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = mongoose.Schema(
    {
        username: { type: String },
        email: { type: String },
        password: { type: String },
        status: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
    },
    { timestamps: true }
);

// Add middleware for password hashing
userSchema.pre('save', function (next) {
	let user = this;
	if (user.isModified('password')) {
		return bcrypt.hash(user.password, 12, function (err, hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			return next();
		});
	} else {
		return next();
	}
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
	  if (err) {
		return callback(err, false);
	  }
	  return callback(null, isMatch);
	});
  };

// Check if the model exists before defining it
const User = mongoose.models.User || mongoose.model('user', userSchema);
module.exports = User;
