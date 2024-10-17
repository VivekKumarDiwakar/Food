const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const foodSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// // Hash password before saving to the database
// foodSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Method to compare password
// foodSchema.methods.comparePassword = function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

const Food = mongoose.model("Food", foodSchema); // Changed to "Food"
module.exports = Food; // Exporting the Food model
