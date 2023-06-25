const { Schema, model } = require('mongoose')
const { UserRoleEnum } = require('../utils/enum')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(UserRoleEnum),
        required: true
    },
},
    { strict: true }
)


const User = model('User', UserSchema)

module.exports = {  User }


