const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Food = require("./models/Food"); // Import the Food model
const cors = require("cors"); // Import cors
require('dotenv').config();

const app = express(); // Initialize Express app
// const PORT = 3000;

// Enable CORS for all routes
app.use(cors({
  origin: ["https://deploy-mern-1whq.vercel.app"],,
  methods:["POST" ,"GET"],
  credentials:true
}));

// Middleware for parsing JSON
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000


// Middleware to log requests
const logRequest = (req, res, next) => {
  console.log(
    `${new Date().toLocaleString()} Request Made to: ${req.originalUrl}`
  );
  next(); // Move to the next middleware
};
app.use(logRequest);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/FoodDatabase", { // Change to your new database name
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


   app.get("/" , async (req ,res) =>{
    res.status(200).json({message : "Hi kya hal hai"});
   })

   app.get('/register', async (req, res) => {
    try {
        const users = await Food.find(); // Retrieves all users
        res.json(users); // Send the retrieved users as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// POST Route to Create a New Customer
app.post("/register", async (req, res) => {

  try {
    const { Email, password } = req.body; // Get Email and password from request body


    // Validate input
    if (!Email || !password) {
      return res.status(400).json({ error: "Missing Email or password" });
    }

    // Check if user already exists
    const existingUser = await Food.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already taken" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer
    const newCustomer = new Food({ Email, password: hashedPassword });
    await newCustomer.save(); // Save to database
    console.log("Hashed password saved" + hashedPassword);

    console.log("Customer data saved");
    res.status(201).json({ message: "User registered successfully" }); // Send back success message
  } catch (err) {
    console.error("Registration Error:", err); // Log detailed error information
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST Route for User Login
app.post("/login", async (req, res) => {
  try {
    const { Email, password } = req.body;

    // Trim email and password to avoid extra spaces
    const trimmedEmail = Email.trim();
    const trimmedPassword = password.trim();

    // Validate input
    if (!trimmedEmail || !trimmedPassword) {
      return res.status(400).json({ error: "Missing Email or password" });
    }

    // Use the correct model, i.e., Food instead of User
    const user = await Food.findOne({ Email: trimmedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid Email or password" });
    }
    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(trimmedPassword, user.password);
    
    console.log("Password comparison result:", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid Email or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





// Start the Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
