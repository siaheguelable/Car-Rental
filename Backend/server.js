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

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// // ====== PASSPORT GITHUB STRATEGY ======
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID || "GITHUB_CLIENT_ID",
//       clientSecret: process.env.GITHUB_CLIENT_SECRET || "GITHUB_CLIENT_SECRET",
//       callbackURL:
//         process.env.GITHUB_CALLBACK_URL ||
//         "http://localhost:30000/auth/github/callback",
//       //"https://car-rental-si5p.onrender.com/oauth-callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       console.log("[OAuth] GitHub verify called. profile summary:", {
//         id: profile.id,
//         username: profile.username,
//         displayName: profile.displayName,
//         emails: profile.emails,
//       });
//     }
//   )
// );

require("./routes/auth")(app); // import routes for authentication

//admin and user login

// // ====== PASSPORT SERIALIZE / DESERIALIZE ======
// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// // ====== AUTH ROUTES ======
// app.get(
//   "/auth/github",
//   passport.authenticate("github", { scope: ["user:email"] })
// );
// app.get(
//   "/auth/github/callback",
//   passport.authenticate("github", {
//     failureRedirect: `${
//       process.env.FRONTEND_URL || "http://localhost:5173"
//     }/userLogin`,
//     successRedirect: `${
//       process.env.FRONTEND_URL || "http://localhost:5173"
//     }/oauth-callback`,
//   })
// );

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
