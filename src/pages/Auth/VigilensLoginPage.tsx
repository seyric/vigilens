import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth.api";
import { saveSession } from "../../utils/session";
import "./vigilens-auth.css";

export default function VigilensLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username || !password) {
      setError("Enter your credentials.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await login({
        username,
        password,
        rank: "Inspector",
        district: "Bengaluru Urban",
      });
      saveSession(response.token.access_token, response.user, rememberMe);
      navigate("/dashboard");
    } catch (requestError: any) {
      const status = requestError.response?.status;
      setError(
        status === 401
          ? "Invalid credentials."
          : status === 403
            ? "Account inactive."
            : "Connection unavailable.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-screen">
      <div className="auth-noise" aria-hidden="true" />
      <header className="auth-brand">
        <a href="/" className="brand-lockup">
          <span className="brand-mark">V</span>
          <span>
            Vigilens<span className="brand-dot">.</span>
          </span>
        </a>
      </header>
      <section className="auth-layout">
        <div className="auth-card glass-panel">
          <div className="auth-card-top">
            <span>Workspace access</span>
            <span className="auth-card-index">01</span>
          </div>
          <div className="auth-card-heading">
            <h2>Sign in</h2>
          </div>
          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Username</span>
              <div>
                <Mail size={16} />
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Username"
                  autoComplete="username"
                  required
                />
              </div>
            </label>
            <label className="auth-field">
              <span>Password</span>
              <div>
                <LockKeyhole size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
            <div className="auth-options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((checked) => !checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#recovery">Need help?</a>
            </div>
            <button className="auth-submit" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Continue"}
              <ArrowUpRight size={17} />
            </button>
          </form>
          <div className="auth-card-footer">
            <ShieldCheck size={15} />
            <span>Secure session</span>
          </div>
        </div>
      </section>
    </main>
  );
}
