import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Envelope, Lock, User, ArrowRight, FileText } from "@phosphor-icons/react";

function formatApiError(detail) {
  if (!detail) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map(e => e?.msg || JSON.stringify(e)).join(" ");
  if (detail?.msg) return detail.msg;
  return String(detail);
}

export default function AuthPage() {
  const location = useLocation();
  const isRegister = location.pathname === "/register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8" data-testid="auth-logo">
          <div className="w-10 h-10 bg-[#FDE047] border-2 border-[#09090B] rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]">
            <FileText size={22} weight="bold" className="text-[#09090B]" />
          </div>
          <span className="font-['Outfit'] font-black text-2xl text-[#09090B]">ResumeAI</span>
        </Link>

        {/* Card */}
        <div className="bg-[#FFFFFF] border-2 border-[#09090B] rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)]" data-testid="auth-card">
          <h1 className="font-['Outfit'] font-bold text-2xl text-[#09090B] mb-1">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-[#52525B] mb-6">
            {isRegister ? "Start building job-ready resumes in minutes" : "Log in to manage your resumes"}
          </p>

          {error && (
            <div className="bg-[#FDA4AF]/20 border-2 border-[#FDA4AF] rounded-xl px-4 py-3 mb-4 text-sm font-medium text-[#09090B]" data-testid="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Google Login - REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH */}
            <button
              type="button"
              onClick={() => {
                const redirectUrl = window.location.origin + '/dashboard';
                window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
              }}
              className="neo-btn w-full px-6 py-3 bg-[#FFFFFF] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] flex items-center justify-center gap-3"
              data-testid="google-login-btn"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E4E4E7]" />
              <span className="text-xs font-bold text-[#A1A1AA] uppercase">or</span>
              <div className="flex-1 h-px bg-[#E4E4E7]" />
            </div>

            {isRegister && (
              <div>
                <label className="text-sm font-bold text-[#09090B] mb-1 block">Full Name</label>
                <div className="relative">
                  <User size={18} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)} required
                    placeholder="John Doe"
                    className="w-full bg-[#FAFAFA] border-2 border-[#09090B] rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-[#09090B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#C4B5FD] shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]"
                    data-testid="auth-name-input"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-[#09090B] mb-1 block">Email</label>
              <div className="relative">
                <Envelope size={18} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="w-full bg-[#FAFAFA] border-2 border-[#09090B] rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-[#09090B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#C4B5FD] shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]"
                  data-testid="auth-email-input"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-[#09090B] mb-1 block">Password</label>
              <div className="relative">
                <Lock size={18} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Min 6 characters"
                  minLength={6}
                  className="w-full bg-[#FAFAFA] border-2 border-[#09090B] rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-[#09090B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#C4B5FD] shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]"
                  data-testid="auth-password-input"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="neo-btn w-full px-6 py-3 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="auth-submit-btn"
            >
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Log In"}
              {!loading && <ArrowRight size={18} weight="bold" />}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-[#52525B]">
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <Link to={isRegister ? "/login" : "/register"} className="font-bold text-[#09090B] underline underline-offset-2" data-testid="auth-switch-link">
              {isRegister ? "Log In" : "Sign Up Free"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
