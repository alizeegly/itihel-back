const mongoose = require('mongoose')

const FlipCardSchema = new mongoose.Schema({
    question:  {
        type: String,
        required: true
    },
    answer:  {
        type: String,
        required: true
    },
    course_id:  {
        type: mongoose.Schema.Types.ObjectId, ref: 'Course',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("FlipCard", FlipCardSchema)