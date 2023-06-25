const { Schema, model } = require('mongoose')
const { MovieGenreEnum } = require('../utils/enum')

const MovieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(MovieGenreEnum),
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


