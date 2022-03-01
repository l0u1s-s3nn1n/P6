/// "models/User.js" config pour la base de données mongoose

//package "mongoose"
const mongoose = require("mongoose");

//package "mongoose-unique-validator" pour bloquer les connections avec la même adresse email
const uniqueValidator = require("mongoose-unique-validator");

//schéma de donné "userSchema"
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//plugin "uniqueValidator"
userSchema.plugin(uniqueValidator);

//exportation "user"
module.exports = mongoose.model("User", userSchema);