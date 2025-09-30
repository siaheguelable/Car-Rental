const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    available: { type: Boolean, default: true },
    image: { type: String }, // optional: store image URL
  },
  { timestamps: true, collection: "cars" }
);
const carModel = mongoose.model("car", carSchema);

module.exports = carModel;
