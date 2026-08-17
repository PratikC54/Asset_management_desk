import "./../styles/AuthPage.css";
import {
  FaClipboardList,
  FaCube,
  FaUser,
  FaLock,
  FaShieldAlt,
  FaChartBar,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      await login(form);
      setStatus({ type: "success", message: "Login successful." });
      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <header className="brand-header">
        <h1>ASSET ISSUE &amp; RETURN MANAGEMENT DESK</h1>
        <p>Secure. Track. Manage.</p>
      </header>
      <div className="auth-card">
        <aside className="auth-aside">
          <div className="illustration" aria-hidden="true">
            <FaClipboardList className="clipboard" />
            <span className="screen" />
            <FaCube className="cube" />
          </div>
          <h2>
            Asset Issue &amp;
            <br />
            Return Management Desk
          </h2>
          <p>
            Efficiently manage asset issuance, returns, and tracking in one
            secure platform.
          </p>
          <div className="features">
            <div className="feature">
              <span className="feature-icon">
                <FaShieldAlt />
              </span>
              <div>
                <h3>Secure Operations</h3>
                <span>Role-based access and data protection</span>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">
                <FaCube />
              </span>
              <div>
                <h3>Track Assets</h3>
                <span>Real-time tracking of issued and returned assets</span>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">
                <FaChartBar />
              </span>
              <div>
                <h3>Detailed Reports</h3>
                <span>Generate insightful reports with ease</span>
              </div>
            </div>
          </div>
        </aside>
        <section className="auth-form-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Welcome Back!</h2>
            <p className="form-intro">Login to continue to your account.</p>
            <label className="field-label" htmlFor="login-identity">
              Email Address
            </label>
            <div className="input-group">
              <FaUser />
              <input
                id="login-identity"
                name="email"
                type="email"
                placeholder="Enter your username or email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <label className="field-label" htmlFor="login-password">
              Password
            </label>
            <div className="input-group">
              <FaLock />
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="options">
            </div>
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
            {status.message && (
              <p className={`form-status ${status.type}`} role="status">
                {status.message}
              </p>
            )}
            <div className="divider">OR</div>
            <p className="bottom-text">
              Don't have an account? <a href="/register">Register</a>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
