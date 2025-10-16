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

// If running behind a proxy (like Render), trust the proxy so secure cookies and
// the request IPs are handled correctly.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Session and Passport setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // When behind HTTPS (Render provides HTTPS), mark cookie as secure in production
      secure: process.env.NODE_ENV === "production",
      // Allow cross-site cookies when frontend is on different domain (set to 'none' when secure)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      // reasonable lifetime (ms)
      maxAge: 24 * 60 * 60 * 1000,
    },
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
        "https://car-rental-si5p.onrender.com/auth/github/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      const User = require("./models/userModel");
      try {
        // Try several places for email: prefer profile.emails array, then profile._json.email, then username
        const email =
          profile.emails?.[0]?.value ||
          profile._json?.email ||
          profile.username;

        // Example: treat a specific email or username as admin
        const isAdmin =
          email === "admin@example.com" || profile.username === "adminuser";

        let user = await User.findOne({ email });
        if (!user) {
          user = new User({
            name: profile.displayName || profile.username || "",
            email,
            // generate a random password for OAuth-created users (they can use OAuth to login)
            password: Math.random().toString(36).slice(-8),
            role: isAdmin ? "admin" : "user",
          });
          await user.save();
        } else if (user.role !== (isAdmin ? "admin" : "user")) {
          user.role = isAdmin ? "admin" : "user";
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
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

// Health check endpoint to verify the backend is running on the deployed host
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "car-rental-backend",
    env: process.env.NODE_ENV || "development",
  });
});

// Use a custom callback so we can log detailed errors during OAuth exchange
app.get("/auth/github/callback", (req, res, next) => {
  passport.authenticate("github", (err, user, info) => {
    if (err) {
      console.error("Passport authenticate error:", err, info);
      // Send a helpful error message for diagnostics
      return res
        .status(500)
        .send("OAuth authentication failed on the server. Check server logs.");
    }
    if (!user) {
      console.warn("OAuth completed but no user returned:", info);
      return res.redirect(process.env.FRONTEND_URL || "/");
    }

    // Log the user for debugging (do not leak in production logs)
    console.log(
      "OAuth login successful for user:",
      user.email || user._id || user
    );

    // Establish a session and redirect
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("Session login error:", loginErr);
        return res
          .status(500)
          .send("Failed to establish session after OAuth. Check server logs.");
      }
      try {
        if (user.role === "admin") {
          return res.redirect(`${process.env.FRONTEND_URL}/adminDashboard`);
        }
        return res.redirect(`${process.env.FRONTEND_URL}/oauth-callback`);
      } catch (redirectErr) {
        console.error("Redirect error:", redirectErr);
        return res
          .status(500)
          .send("OAuth succeeded but redirect failed. Check server logs.");
      }
    });
  })(req, res, next);
});

app.get("/api/user", (req, res) => {
  // Return DB user object stored in session (already has password removed in deserialize)
  res.json(req.user || null);
});

// admin
// ...existing code...

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

module.exports = app;
