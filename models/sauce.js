/// "models/Sauce.js" config pour la base de données mongoose

//package "mongoose"
const mongoose = require("mongoose");

//schéma de données "sauce" (RegEx)
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: {
    type: String,
    match: /^[a-zA-Z0-9 éèêâäçûüîïôö'_-]+$/,
    required: true,
  },
  manufacturer: {
    type: String,
    match: /^[a-zA-Z0-9 éèêâäçûüîïôö'_-]+$/,
    required: true,
  },
  description: {
    type: String,
    match: /^[a-zA-Z0-9 éèêâäçûüîïôö'_-]+$/,
    required: true,
  },
  mainPepper: {
    type: String,
    match: /^[a-zA-Z0-9 éèêâäçûüîïôö'_-]+$/,
    required: true,
  },
  imageUrl: { type: String, required: true },
  heat: { type: Number, min: 1, max: 10, required: true },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});

//exportation "sauce"
module.exports = mongoose.model("Sauce", sauceSchema);