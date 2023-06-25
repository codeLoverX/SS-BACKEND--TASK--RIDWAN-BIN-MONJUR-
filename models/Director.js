const { Schema, model } = require('mongoose')

const DirectorSchema = new Schema({
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


const Director = model('Director', DirectorSchema)

module.exports = { Director }


