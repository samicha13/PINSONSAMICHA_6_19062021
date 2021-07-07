//Import mongoose
const mongoose = require('mongoose');

// Sauce data model
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, //id sauce
  name: { type: String, required: true }, //nom sauce
  manufacturer: { type: String, required: true },//créateur de la sauce
  description: { type: String, required: true },//description
  mainPepper: { type: String, required: true },//Ingredients
  imageUrl: { type: String, required: true },// image
  heat: { type: Number, required: true, min: 1, max: 10},//intensité de la sauce
  // gérer les likes et dislikes
  likes: { type: Number, default: 0 }, //nb like
  dislikes: { type: Number, default: 0 }, // nb dislike
  usersLiked: { type: [String], default: [] },// utilisateurs qui ont aimé la sauce
  usersDisliked: { type: [String], default: [] }// utilisateurs qui n'ont pas aimé la sauce
});
module.exports = mongoose.model('Sauce', sauceSchema);