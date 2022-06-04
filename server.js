const express = require('express')
const app = express()
const session = require('express-session')
const helmet = require('helmet');
const cors = require("cors")

const {
    USER, 
    QUIZZ, 
    COURSES, 
    SHARED, 
    FLIPCARDS
} = require("./routes")
const { HOST, PORT } = require("./config/config");
const connectDB = require('./config/connectDB');

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet())
app.use(cors())


// ROUTES
app.use('/api/users', USER)
app.use('/api/courses', COURSES)
app.use('/api/courses-shared', SHARED)
// app.use('/api/flip-cards', FLIPCARDS)
// app.use('/api/quizz', QUIZZ)


app.listen(PORT, () => {
    console.log(`Backend server started on http://${HOST}:${PORT}`)
})