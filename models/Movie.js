const { Schema, model } = require('mongoose')
const { MovieGenreEnum } = require('../utils/enum')

const MovieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
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
    actors: [{
        type: Schema.Types.ObjectId, ref: 'Actor', required: false
    }],
    director: {
        type: Schema.Types.ObjectId, ref: 'Director', required: false
    }
},
    { strict: true }
)

const Movie = model('Movie', MovieSchema)

module.exports = {  Movie }


