import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post(
        "/account/login",
        {
          email,
          password,
          rememberMe: true,
        },
        { withCredentials: true }
      );

      const { id, email: userEmail, roles } = response.data;

      if (!roles.includes("Admin")) {
        localStorage.removeItem("user");
        setError("Access denied.");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({ id, email: userEmail, roles })
      );

      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="text-center mb-4">
          <h4 className="navbar-brand mb-1">
            Rider Management
          </h4>
          <p className="text-muted">
            Rider Recruitment Dashboard
          </p>
        </div>

        <h5 className="text-center mb-3">
          Welcome Back
        </h5>

        {error && (
          <div className="alert alert-danger py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-brand w-100"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            © {new Date().getFullYear()} Rider Management
          </small>
        </div>
      </div>
    </div>
  );
}