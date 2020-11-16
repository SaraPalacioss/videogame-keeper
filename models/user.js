const mongoose = require('mongoose');
const Videogame = require('./Videogame');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    videogames: [{type: Schema.ObjectId, ref: 'Videgame'}]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
