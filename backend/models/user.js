//Import Mongoose
const mongoose = require('mongoose');

//Import Mongoose unique validator
const uniqueValidator = require('mongoose-unique-validator');

//schema de l'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required:[true, 'Veuillez rentrer votre email'] , unique: true, lowercase: true, maxlength:[320, 'L émail ne peut depasser 320 caratéres']},

  password: { type: String, required: true },
});

// Utilisation du module  uniqueValidator sur le schéma de l'utilisateur
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);