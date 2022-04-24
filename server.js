

const express = require('express');
const cors = require("cors");
const app = express();
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router = require('./router');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");


app.use(express.static(path.join(__dirname, './build')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin@MHG168',
    database: 'restaurant'
});

db.connect(function(err) {
    if (err) {
        console.log(err);
        throw err;
        return false;
    }
    console.log('Connected to database');
});

const sessionStore = new MySQLStore({
  expiration: (1825 * 86400 * 1000),
  endConnectionOnClose: false,
} , db);

app.use(session({ 
  key: 'session_cookie_name',
  secret: 'admin@MHG168',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: (1825 * 86400 * 1000),
    httpOnly: false,
  },
}));

new Router(app, db);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});