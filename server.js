const express = require('express')
const app = express()
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const helmet = require('helmet');
const cors = require("cors")

const {
    USER, 
    QUIZZ, 
    COURSES, 
    SHARED, 
    FLIPCARDS
} = require("./routes")
const {
    HOST,
    PORT,
    SESS_SECRET,
    NODE_ENV,
    IS_PROD,
    COOKIE_NAME
} = require("./config/config");
const { MongoURI } = require("./config/database");
const MAX_AGE = 1000 * 60 * 60 * 3; // Three hours


// DB CONNECTION
mongoose.connect( MongoURI, {useNewUrlParser: true} )
        .then(() => console.log("DB Connection Successful !"))
        .catch((err) => console.log(err))

const store = new MongoDBStore({
    uri: MongoURI,
    collection: "sessions"
})

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    session({
        name: COOKIE_NAME, //name to be put in "key" field in postman etc
        secret: SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: MAX_AGE,
            sameSite: false,
            secure: IS_PROD
        }
    })
);


app.use(helmet())
app.use(cors())


// ROUTES
app.get('/', function(req, res) {
    res.send('API is working perfectly');
});
  
app.use('/api/users', USER)
app.use('/api/courses', COURSES)
app.use('/api/courses-shared', SHARED)
app.use('/api/flip-cards', FLIPCARDS)
app.use('/api/quizz', QUIZZ)


app.listen(PORT, () => {
    console.log(`Backend server started on http://${HOST}:${PORT}`)
})