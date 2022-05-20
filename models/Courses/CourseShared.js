const mongoose = require('mongoose')

const CourseSharedSchema = new mongoose.Schema({
    course_id:  {
        type: mongoose.Schema.Types.ObjectId, ref: 'Course',
        required: true
    },
    user_id:  {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    roles:  [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Role',
        required: true
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("CourseShared", CourseSharedSchema)