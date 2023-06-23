const { Schema, model } = require('mongoose')

const MovieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    runtime: {
        type: Number,
        required: true
    },
},
    { strict: true }
)


const Movie = model('Movie', MovieSchema)

module.exports = {  Movie }


