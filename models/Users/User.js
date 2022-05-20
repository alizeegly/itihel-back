const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    pseudo: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String,
        default: ""
    },
    last_connection: {
        type: Date
    },
    courses : [
        {type: mongoose.Schema.Types.ObjectId,ref:'Course'}
    ]
}, {
    timestamps: true
})

module.exports  = mongoose.model("User", UserSchema)