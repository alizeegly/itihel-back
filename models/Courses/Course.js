const mongoose = require('mongoose')
const mongooseFindAndFilter = require('mongoose-find-and-filter');

const CourseSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true
    },
    text:  {
        type: Object,
        default: {}
    },
    is_public: {
        type: Boolean,
        default: false
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    picture: {
        type: String,
        default: ""
    },
    categories:  [
        {type: mongoose.Schema.Types.ObjectId,ref:'Category'}
    ],
    description: {
        type: String,
        default: ""
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'
    }
}, {
    timestamps: true
})

CourseSchema.plugin(mongooseFindAndFilter);

module.exports = mongoose.model("Course", CourseSchema)