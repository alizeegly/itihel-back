const mongoose = require('mongoose')

const ScoreSchema = new mongoose.Schema({
    score:  {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', 
        required: true
    },
    quiz_id:  {
        type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', 
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Score", ScoreSchema)