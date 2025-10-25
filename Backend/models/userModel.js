const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    githubId: { type: String, unique: true }, // store GitHub id
  },
  { timestamps: true, collection: "users" }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
