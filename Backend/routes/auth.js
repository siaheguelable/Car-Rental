const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/userModel");

module.exports = (app) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });
          if (!user) {
            console.log("[OAuth] Creating new user:", profile);
            let email = profile.emails?.[0]?.value || "";
            if (!email) email = `github_${profile.id}@noemail.com`;
            user = await User.create({
              githubId: profile.id,
              username: profile.username,
              email: email,
              role: "user",
            });
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  app.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
      // 🔹 Store session + redirect to frontend
      res.redirect("http://localhost:5173/oauth-callback");
    }
  );

  // Return session user info
  app.get("/auth/user", (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Not logged in" });
    const { _id, username, email, role } = req.user;
    res.json({ _id, username, email, role });
  });

  app.get("/auth/logout", (req, res) => {
    req.logout(() => {
      res.redirect("http://localhost:5173/userLogin");
    });
  });

  // Admin login
  app.get(
    "/auth/admin/github",
    (req, res, next) => {
      req.session.oauthRedirect = "/adminDashboard"; // store redirect target
      next();
    },
    passport.authenticate("github", { scope: ["user:email"] })
  );

  app.get(
    "/auth/admin/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
      const redirectTo = req.session.oauthRedirect || "/adminDashboard";
      delete req.session.oauthRedirect;
      res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}${redirectTo}`
      );
    }
  );
};
