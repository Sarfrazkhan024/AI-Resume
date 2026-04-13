import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallback from "./components/AuthCallback";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import PricingPage from "./pages/PricingPage";
import PublicResumePage from "./pages/PublicResumePage";

function AppLayout({ children, hideNav }) {
  return (
    <>
      {!hideNav && <Navbar />}
      {children}
    </>
  );
}

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
function AppRouter() {
  const location = useLocation();
  // Check URL fragment for session_id from Google OAuth - detect synchronously before routes render
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
      <Route path="/login" element={<AppLayout hideNav><AuthPage /></AppLayout>} />
      <Route path="/register" element={<AppLayout hideNav><AuthPage /></AppLayout>} />
      <Route path="/pricing" element={<AppLayout><PricingPage /></AppLayout>} />
      <Route path="/dashboard" element={<AppLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AppLayout>} />
      <Route path="/builder/:sessionId" element={<AppLayout><ProtectedRoute><ResumeBuilder /></ProtectedRoute></AppLayout>} />
      <Route path="/share/:shareId" element={<PublicResumePage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors closeButton />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
