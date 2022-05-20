const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema({
    quizTitle:  {
        type: String,
        required: true
    },
    quizSynopsis:  {
        type: String,
        required: true
    },
    questions: {
        type: Array
    },
    course_id:  {
        type: mongoose.Schema.Types.ObjectId, ref: 'Course',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Quiz", QuizSchema, "quizz")