const mongoose = require('mongoose')

const RoleSchema = new mongoose.Schema({
    identifiant: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports  = mongoose.model("Role", RoleSchema)