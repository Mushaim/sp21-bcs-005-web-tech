const mongoose = require('mongoose');
const User = require('./user.model');
const retry = require('retry');
const mongoURI = 'mongodb+srv://mushaimk01:cutegirl01@cluster0.6ebdcom.mongodb.net/?retryWrites=true&w=majority/task-manager';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const operation = retry.operation({
    retries: 3, // Number of retries
    factor: 2, // Exponential backoff factor
    minTimeout: 1000, // Initial delay before first retry in milliseconds
    maxTimeout: 3000 // Maximum delay between retries in milliseconds
});

operation.attempt((currentAttempt) => {
    const newUser = new User({
        username: 'example',
        email: 'example@example.com',
        password: 'password'
    });

    newUser.save()
        .then(savedUser => {
            console.log('User added successfully:', savedUser);
        })
        .catch(error => {
            if (operation.retry(error)) {
                console.error(`Error adding user, retry ${currentAttempt}:`, error);
                return;
            }
            console.error('Retry attempts exhausted, could not add user:', error);
        });
});