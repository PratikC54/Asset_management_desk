import "./../styles/AuthPage.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaClipboardList,
  FaShieldAlt,
  FaChartBar,
  FaCube,
} from "react-icons/fa";
import { useState } from "react";
import { registerUser } from "../api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {

    const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (form.password !== form.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department,
      });
      setStatus({
        type: "success",
        message: "Account created. You can now log in.",
      });

      toast.success("Account created successfully! Please log in.");
        navigate("/login");

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
            <h2>Create Your Account</h2>
            <p className="form-intro">
              Fill in the details below to get started.
            </p>
            <label className="field-label" htmlFor="register-name">
              Full Name
            </label>
            <div className="input-group">
              <FaUser />
              <input
                id="register-name"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <label className="field-label" htmlFor="register-email">
              Email Address
            </label>
            <div className="input-group">
              <FaEnvelope />
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <label className="field-label" htmlFor="register-password">
              Password
            </label>
            <div className="input-group">
              <FaLock />
              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <label className="field-label" htmlFor="register-confirm">
              Confirm Password
            </label>
            <div className="input-group">
              <FaLock />
              <input
                id="register-confirm"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <label className="field-label" htmlFor="register-department">
              Department
            </label>
            <div className="input-group">
              <FaBuilding />
              <select
                id="register-department"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your department
                </option>
                <option>IT</option>
                <option>HR</option>
                <option>ACCOUNTS</option>
              </select>
            </div>
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
            {status.message && (
              <p className={`form-status ${status.type}`} role="status">
                {status.message}
              </p>
            )}
            <p className="bottom-text">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
