const { Schema, model } = require('mongoose')

const ActorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    movies: [{
        type: Schema.Types.ObjectId, ref: 'Movie', required: false
    }]
},
    { strict: true }
)

const Actor = model('Actor', ActorSchema)

module.exports = { Actor }


