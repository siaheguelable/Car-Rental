const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB ✅");
  } catch (err) {
    console.error("Failed to connect to MongoDB ❌", err);
  }
};

module.exports = connectDB;
