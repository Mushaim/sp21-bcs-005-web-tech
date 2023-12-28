const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://mushaimk01:cutegirl01@cluster1.a4ibr1b.mongodb.net/taskManager?retryWrites=true&w=majority';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(mongoURI, options).then(() => {
    console.log('Database connection established!');
}).catch(err => {
    console.log('Error connecting Database instance due to: ', err);
});