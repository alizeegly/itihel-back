const { MongoDBStore } = require('connect-mongodb-session');
const mongoose = require('mongoose')
require("dotenv").config()

mongoose
    .connect( process.env.MONGODB_URI, {useNewUrlParser: true} )
    .then(() => console.log("DB Connection Successful !"))
    .catch((err) => console.log(err))

const mongoDBstore = new MongoDBStore({
    uri: MongoURI,
    collection: "sessions"
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express-Session
app.use(
    session({
        name: COOKIE_NAME, //name to be put in "key" field in postman etc
        secret: SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        store: mongoDBstore,
        cookie: {
        maxAge: MAX_AGE,
        sameSite: false,
        secure: IS_PROD
        }
    })
);