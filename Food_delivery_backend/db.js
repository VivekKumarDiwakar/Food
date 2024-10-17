const mongoose = require("mongoose");

const mongoDB_URL = "mongodb://localhost:27017/Login";

mongoose.connect(mongoDB_URL);

const db = mongoose.connection;
// Drop the collection
// db.customers.drop();

db.on("connected", () => {
  console.log("Connected to MongoDB server");
});

db.on("error", (err) => {
  console.log("MongoDB connection error :", err);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

//  Export the databases connection represent the mongoDB connection
module.exports = db;
