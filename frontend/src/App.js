import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import PricingPage from "./pages/PricingPage";

function AppLayout({ children, hideNav }) {
  return (
    <>
      {!hideNav && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
          <Route path="/login" element={<AppLayout hideNav><AuthPage /></AppLayout>} />
          <Route path="/register" element={<AppLayout hideNav><AuthPage /></AppLayout>} />
          <Route path="/pricing" element={<AppLayout><PricingPage /></AppLayout>} />
          <Route path="/dashboard" element={<AppLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AppLayout>} />
          <Route path="/builder/:sessionId" element={<AppLayout><ProtectedRoute><ResumeBuilder /></ProtectedRoute></AppLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
