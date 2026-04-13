import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
export default function AuthCallback() {
  const hasProcessed = useRef(false);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const sessionId = params.get("session_id");

    if (!sessionId) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        await loginWithGoogle(sessionId);
        // Clear hash and navigate to dashboard
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Google auth failed:", err);
        navigate("/login");
      }
    })();
  }, [navigate, loginWithGoogle]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]" data-testid="auth-callback">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FDE047] animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="w-3 h-3 rounded-full bg-[#A7F3D0] animate-bounce" style={{ animationDelay: "0.15s" }} />
        <div className="w-3 h-3 rounded-full bg-[#C4B5FD] animate-bounce" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}
