const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session')
const {db} = require('./db')
const passport = require('passport')

//config to store session
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const dbStore = new SequelizeStore({ db: db })
dbStore.sync()

//loggin middleware
app.use(morgan('dev'));

//body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'superSecret or not',
  store: dbStore,
  resave: false,
  saveUninitialized: false
}))

//
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', require('./api'))

// static middleware
app.use(express.static(path.join(__dirname, '../public')));

//if someone enters an invalid URI, will be redirect to index.html
//make sure it's bellow any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


// Handle 500 Errors
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

module.exports = app