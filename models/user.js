/**IMPORT */
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/**SSCHEMA USER */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
//plugin mongoose validator
userSchema.plugin(uniqueValidator);
//export to mongoose/express
module.exports = mongoose.model("User", userSchema);