import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { List, X, SignOut, User, FileText, CurrencyDollar } from "@phosphor-icons/react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-sm border-b-2 border-[#09090B]" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2" data-testid="nav-logo">
            <div className="w-8 h-8 bg-[#FDE047] border-2 border-[#09090B] rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
              <FileText size={18} weight="bold" className="text-[#09090B]" />
            </div>
            <span className="font-['Outfit'] font-black text-xl text-[#09090B]">ResumeAI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive("/dashboard") ? "bg-[#FDE047] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" : "hover:bg-[#E4E4E7]"}`} data-testid="nav-dashboard">
                  Dashboard
                </Link>
                <Link to="/pricing" className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive("/pricing") ? "bg-[#FDE047] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" : "hover:bg-[#E4E4E7]"}`} data-testid="nav-pricing">
                  Pricing
                </Link>
                <div className="flex items-center gap-2 ml-2 px-4 py-2 bg-[#FFFFFF] border-2 border-[#09090B] rounded-full shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
                  <User size={16} weight="bold" />
                  <span className="text-sm font-bold truncate max-w-[120px]">{user.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${user.plan === "pro" ? "bg-[#C4B5FD] text-[#09090B]" : "bg-[#E4E4E7] text-[#52525B]"}`}>
                    {user.plan === "pro" ? "PRO" : "FREE"}
                  </span>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-[#FDA4AF]/30 rounded-full transition-all" data-testid="nav-logout">
                  <SignOut size={20} weight="bold" className="text-[#09090B]" />
                </button>
              </>
            ) : (
              <>
                <Link to="/pricing" className="px-4 py-2 text-sm font-bold hover:bg-[#E4E4E7] rounded-full transition-all" data-testid="nav-pricing-guest">Pricing</Link>
                <Link to="/login" className="neo-btn px-6 py-2 bg-[#FFFFFF] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] text-sm" data-testid="nav-login">Log In</Link>
                <Link to="/register" className="neo-btn px-6 py-2 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] text-sm" data-testid="nav-register">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} data-testid="nav-mobile-toggle">
            {menuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 animate-slide-up" data-testid="nav-mobile-menu">
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-4 py-3 bg-[#FFFFFF] border-2 border-[#09090B] rounded-xl shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
                  <User size={18} weight="bold" />
                  <span className="font-bold">{user.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ml-auto ${user.plan === "pro" ? "bg-[#C4B5FD]" : "bg-[#E4E4E7]"}`}>
                    {user.plan === "pro" ? "PRO" : "FREE"}
                  </span>
                </div>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-3 font-bold hover:bg-[#E4E4E7] rounded-xl transition-all" data-testid="nav-mobile-dashboard">Dashboard</Link>
                <Link to="/pricing" onClick={() => setMenuOpen(false)} className="px-4 py-3 font-bold hover:bg-[#E4E4E7] rounded-xl transition-all" data-testid="nav-mobile-pricing">Pricing</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="px-4 py-3 font-bold text-left hover:bg-[#FDA4AF]/30 rounded-xl transition-all" data-testid="nav-mobile-logout">Log Out</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/pricing" onClick={() => setMenuOpen(false)} className="px-4 py-3 font-bold hover:bg-[#E4E4E7] rounded-xl">Pricing</Link>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="neo-btn px-4 py-3 bg-[#FFFFFF] text-center border-2 border-[#09090B] rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">Log In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="neo-btn px-4 py-3 bg-[#FDE047] text-center border-2 border-[#09090B] rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">Sign Up Free</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
