// import
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;
//database connection
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error)=>console.log(error));
db.once('open', ()=>console.log('Connected to Database'));


//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: "shh its a secret",
    resave: false,
    saveUninitialized: true

}));
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});
  


app.set('view engine', 'ejs');


app.use("", require('./routes/routes'));


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});