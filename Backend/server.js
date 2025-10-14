const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./DB/connection");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger-output.json"); // Add this line

const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

require("dotenv").config();

connectDB();
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:30000",
    "https://car-rental-si5p.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// CORS FIRST!
app.use(cors(corsOptions));

// Session and Passport setup
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Configure the GitHub strategy for use by Passport
// Passport GitHub Strategy setup
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "GITHUB_CLIENT_ID",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "GITHUB_CLIENT_SECRET",
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        "http://localhost:30000/auth/github/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      const User = require("./models/userModel");
      // Example: treat a specific email or username as admin
      const isAdmin =
        profile._json?.email === "admin@example.com" ||
        profile.username === "adminuser";
      let user = await User.findOne({
        email: profile._json?.email || profile.username,
      });
      if (!user) {
        user = new User({
          name: profile.displayName || profile.username || "",
          email: profile._json?.email || profile.username,
          password: Math.random().toString(36).slice(-8),
          role: isAdmin ? "admin" : "user", // <-- set role here
        });
        await user.save();
      } else if (user.role !== (isAdmin ? "admin" : "user")) {
        user.role = isAdmin ? "admin" : "user";
        await user.save();
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  // Serialize the DB user _id into session
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const User = require("./models/userModel");
    const user = await User.findById(id).select("-password");
    done(null, user || null);
  } catch (err) {
    done(err);
  }
});

// Routes
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    if (req.user.role === "admin") {
      res.redirect("http://localhost:5173/adminDashboard");
    } else {
      res.redirect("http://localhost:5173/oauth-callback");
    }
  }
);

app.get("/api/user", (req, res) => {
  // Return DB user object stored in session (already has password removed in deserialize)
  res.json(req.user || null);
});

// admin
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// app.get(
//   "/auth/github/callback",
//   passport.authenticate("github", { failureRedirect: "/" }),
//   (req, res) => {
//     // Redirect to frontend after successful login
//     res.redirect("http://localhost:5173/adminDashboard");
//   }
// );

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use("/", userRoutes);
app.use("/api", carRoutes);
app.use("/api", bookingRoutes);
app.use("/api", adminRoutes);
// The environment variables are loaded from the .env file
const port = process.env.PORT || 30000;
const host = process.env.HOST || "localhost";

// The server listens on the specified port

app.listen(port, () => {
  console.log(`Server is running at http://${host}:${port}`);
  console.log(`Swagger docs at http://${host}:${port}/api-docs`);
});

const User = require("./models/userModel");
