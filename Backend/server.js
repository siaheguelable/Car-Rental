const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./DB/connection");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger-output.json");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
require("dotenv").config();

// ====== DATABASE CONNECTION ======
connectDB();

// ====== CORS CONFIGURATION ======
const corsOptions = {
  origin: [
    "http://localhost:5173", // Vite dev server
    "http://localhost:30000", // Local backend
    "https://car-rental-si5p.onrender.com", // Render backend
    "https://car-rental-2-8y9s.onrender.com", // Render frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ====== TRUST PROXY (for Render HTTPS) ======
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ====== SESSION SETUP ======
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ====== PASSPORT GITHUB STRATEGY ======
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "GITHUB_CLIENT_ID",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "GITHUB_CLIENT_SECRET",
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        //"http://localhost:30000/oauth-callback",
        "https://car-rental-si5p.onrender.com/oauth-callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("[OAuth] GitHub verify called. profile summary:", {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        emails: profile.emails,
      });
      const User = require("./models/userModel");
      try {
        const email =
          profile.emails?.[0]?.value ||
          profile._json?.email ||
          profile.username;

        const isAdmin =
          email === "admin@example.com" || profile.username === "adminuser";

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            name: profile.displayName || profile.username || "",
            email,
            password: Math.random().toString(36).slice(-8),
            role: isAdmin ? "admin" : "user",
          });
          await user.save();
          console.log("[OAuth] Created new user from GitHub profile:", {
            email: user.email,
            id: user._id,
          });
        }
        console.log(
          "[OAuth] Verified user exists, proceeding to done(null,user)",
          { id: user._id, email: user.email }
        );
        return done(null, user);
      } catch (err) {
        console.error("[OAuth] verify error:", err);
        return done(err);
      }
    }
  )
);

// ====== PASSPORT SESSION MANAGEMENT ======
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const User = require("./models/userModel");
    const user = await User.findById(id).select("-password");
    done(null, user || null);
  } catch (err) {
    done(err);
  }
});

// ====== AUTH ROUTES ======
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get("/oauth-callback", (req, res, next) => {
  console.log("[OAuth] /oauth-callback route hit. query:", req.query);
  passport.authenticate("github", (err, user) => {
    if (err) {
      console.error("[OAuth] authenticate error:", err);
      return res.redirect(
        `${
          process.env.FRONTEND_URL || "https://car-rental-2-8y9s.onrender.com"
        }/userLogin`
      );
    }
    if (!user) {
      console.warn(
        "[OAuth] authenticate returned no user; redirecting to frontend login"
      );
      return res.redirect(
        `${
          process.env.FRONTEND_URL || "https://car-rental-2-8y9s.onrender.com"
        }/userLogin`
      );
    }

    console.log("[OAuth] user returned from authenticate, calling req.logIn", {
      id: user._id,
      email: user.email,
    });
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("[OAuth] Session login error:", loginErr);
        return res.status(500).send("Session login failed.");
      }

      const frontendUrl =
        process.env.FRONTEND_URL || "https://car-rental-2-8y9s.onrender.com";
      if (user.role === "admin") {
        console.log("[OAuth] redirecting admin to adminDashboard");
        return res.redirect(`${frontendUrl}/adminDashboard`);
      }
      console.log("[OAuth] redirecting user to frontend root with oauth flag");
      // Instead of redirecting to a frontend route that may 404 on static hosts,
      // send users to the frontend root with a flag so the SPA can finish the flow.
      return res.redirect(`${frontendUrl}/?oauth=github`);
    });
  })(req, res, next);
});

// ====== HEALTH CHECK ======
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "car-rental-backend",
    env: process.env.NODE_ENV || "development",
  });
});

// ====== USER SESSION ROUTE ======
app.get("/api/user", (req, res) => {
  res.json(req.user || null);
});

// ====== SWAGGER DOCS ======
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ====== BODY PARSER ======
app.use(express.json());

// ====== APP ROUTES ======
app.use("/", userRoutes);
app.use("/api", carRoutes);
app.use("/api", bookingRoutes);
app.use("/api", adminRoutes);

// ====== SERVER CONFIG ======
const port = process.env.PORT || 30000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`🚗 Server running at http://${host}:${port}`);
  console.log(`📘 Swagger docs at http://${host}:${port}/api-docs`);
});

module.exports = app;
