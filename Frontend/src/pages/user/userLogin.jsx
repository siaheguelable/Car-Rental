import React, { useState } from "react";
import "../../styles/userstyle.css";

function UserLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGitLogin = () => {
    window.location.href = "http://localhost:30000/auth/github";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.password) {
      setError("Please provide email and password");
      return;
    }
    setLoading(true);
    try {
      // Simulate login request
      await new Promise((res) => setTimeout(res, 600));
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img
            className="mx-auto h-16 w-auto"
            src="/logo.png"
            alt="Car Rental Logo"
          />
          <h2 className="login-title">Login to your account</h2>
          <p className="login-subtitle">Enter your credentials or continue with GitHub</p>
        </div>

        <div className="login-card">
          {error && (
            <div className="error-msg">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="login-input"
              />
            </div>

            <div className="field password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="login-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <span className="eye">�</span> : <span className="eye">👁️</span>}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary full"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            onClick={handleGitLogin}
            disabled={loading}
            className="github-btn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="icon-github" aria-hidden="true">
              <path d="M12 .5C5.73.5.84 5.39.84 11.66c0 4.86 3.14 8.99 7.5 10.45.55.1.75-.24.75-.53 0-.26-.01-.95-.01-1.86-3.05.66-3.69-1.35-3.69-1.35-.5-1.29-1.22-1.64-1.22-1.64-.99-.68.08-.67.08-.67 1.09.08 1.66 1.12 1.66 1.12.97 1.66 2.55 1.18 3.17.9.1-.7.38-1.18.69-1.45-2.44-.28-5-1.22-5-5.43 0-1.2.43-2.18 1.12-2.95-.11-.28-.49-1.4.11-2.92 0 0 .91-.29 2.98 1.12a10.4 10.4 0 012.71-.36c.92.01 1.85.12 2.71.36 2.07-1.41 2.98-1.12 2.98-1.12.6 1.52.22 2.64.11 2.92.7.77 1.12 1.75 1.12 2.95 0 4.21-2.57 5.15-5.01 5.42.39.33.74.98.74 1.98 0 1.43-.01 2.58-.01 2.93 0 .29.2.64.76.53 4.36-1.47 7.5-5.6 7.5-10.45C23.16 5.39 18.27.5 12 .5z" />
            </svg>
            <span>Sign in with GitHub</span>
          </button>

          <p className="register-line">
            Don’t have an account? {" "}
            <a href="/register" className="register-link">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
