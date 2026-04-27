import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lightning, ChatCircle, FileText, ArrowRight, Star, Checks, Users, Rocket, LinkedinLogo, Palette, ChartBar, Envelope, ShareNetwork } from "@phosphor-icons/react";

const features = [
  { icon: ChatCircle, title: "Chat-based Builder", desc: "Answer simple questions like texting a friend. No resume skills needed.", color: "bg-[#A7F3D0]" },
  { icon: Lightning, title: "AI-Powered Writing", desc: "GPT-4o rewrites your answers into professional, ATS-friendly language.", color: "bg-[#FDE047]" },
  { icon: FileText, title: "Job-Specific Resumes", desc: "Different resume for each company. Match the job description perfectly.", color: "bg-[#C4B5FD]" },
  { icon: Checks, title: "ATS Optimized", desc: "Smart keyword suggestions ensure your resume passes automated screening.", color: "bg-[#FDE047]" },
  { icon: Palette, title: "10 Premium Templates", desc: "From minimalist to bold — pick the look that fits your industry.", color: "bg-[#A7F3D0]" },
  { icon: Rocket, title: "Ready in 5 Minutes", desc: "From zero to job-ready resume. Faster than ordering food online.", color: "bg-[#C4B5FD]" },
  { icon: ChartBar, title: "ATS Score Check", desc: "AI analyzes your resume and gives actionable improvement tips.", color: "bg-[#FDE047]" },
  { icon: Envelope, title: "Cover Letters", desc: "One-click AI cover letters personalized to each job application.", color: "bg-[#A7F3D0]" },
  { icon: LinkedinLogo, title: "LinkedIn Import", desc: "Upload your LinkedIn PDF and get a complete resume instantly.", color: "bg-[#C4B5FD]" },
];

const steps = [
  { num: "01", title: "Tell us the job", desc: "Select your target role and company", emoji: "target" },
  { num: "02", title: "Answer questions", desc: "Simple chat — like talking to a friend", emoji: "chat" },
  { num: "03", title: "Get your resume", desc: "AI creates your perfect resume instantly", emoji: "resume" },
];

const testimonials = [
  { name: "Priya S.", role: "Fresher, Pune", text: "Got 3 interview calls in the first week. My college friends couldn't believe how professional my resume looked!", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" },
  { name: "Rahul K.", role: "Job Switcher, Delhi", text: "Made 5 different resumes for 5 companies in 10 minutes. Each one tailored perfectly. This is magic!", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=200&auto=format&fit=crop" },
  { name: "Ananya M.", role: "College Student, Bangalore", text: "The AI cover letter feature saved me hours. Got shortlisted at 3 MNCs in one week!", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] border-2 border-[#09090B] rounded-full shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] mb-8 animate-slide-up" data-testid="hero-badge">
            <Lightning size={16} weight="fill" className="text-[#FDE047]" />
            <span className="text-sm font-bold">5-minute resume promise</span>
          </div>

          <h1 className="font-['Outfit'] font-black text-4xl sm:text-5xl lg:text-6xl text-[#09090B] tracking-tight leading-[1.1] animate-slide-up stagger-1" data-testid="hero-title">
            Stop struggling with resumes.
            <br />
            <span className="gradient-text">Just answer questions.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#52525B] max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-2" data-testid="hero-subtitle">
            One profile. Multiple resumes. Different jobs. Higher chances.
            <br className="hidden sm:block" />
            Your resume should match the job — not be the same everywhere.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-slide-up stagger-3">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="neo-btn w-full sm:w-auto px-8 py-4 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold text-base shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] flex items-center justify-center gap-2"
              data-testid="hero-cta"
            >
              Create Your Resume Free <ArrowRight size={20} weight="bold" />
            </Link>
            <span className="text-sm text-[#52525B] font-medium">No credit card required</span>
          </div>

          <div className="flex items-center justify-center gap-8 mt-8 animate-slide-up stagger-4">
            <div className="flex items-center gap-1.5 text-sm text-[#52525B]">
              <Users size={16} weight="bold" /><span className="font-bold text-[#09090B]">10,000+</span> resumes
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#52525B]">
              <Star size={16} weight="fill" className="text-[#FDE047]" /><span className="font-bold text-[#09090B]">4.9/5</span> rating
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#52525B]">
              <Checks size={16} weight="bold" className="text-[#A7F3D0]" /><span className="font-bold text-[#09090B]">ATS</span> optimized
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-8 w-14 h-14 bg-[#FDE047] border-2 border-[#09090B] rounded-lg shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] rotate-12 hidden lg:block animate-slide-up" />
        <div className="absolute top-40 right-12 w-10 h-10 bg-[#A7F3D0] border-2 border-[#09090B] rounded-full shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] hidden lg:block animate-slide-up stagger-1" />
        <div className="absolute bottom-20 left-16 w-8 h-8 bg-[#C4B5FD] border-2 border-[#09090B] rounded-lg shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] -rotate-12 hidden lg:block animate-slide-up stagger-2" />
        <div className="absolute bottom-32 right-20 w-6 h-6 bg-[#FDA4AF] border-2 border-[#09090B] rounded-full shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] hidden lg:block animate-slide-up stagger-3" />
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-8 py-16 lg:py-24 bg-[#FFFFFF] border-y-2 border-[#09090B]" data-testid="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#52525B] bg-[#FDE047] px-4 py-1.5 rounded-full border-2 border-[#09090B] shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] mb-4">How it works</span>
            <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#09090B]">
              3 steps. 5 minutes. Job-ready.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="bg-[#FFFFFF] border-2 border-[#09090B] rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] hover:translate-y-[-4px] hover:shadow-[8px_10px_0px_0px_rgba(9,9,11,1)] transition-all" data-testid={`step-card-${i}`}>
                <span className="font-['Outfit'] font-black text-5xl text-[#FDE047]">{step.num}</span>
                <h3 className="font-['Outfit'] font-bold text-xl mt-3 text-[#09090B]">{step.title}</h3>
                <p className="text-sm text-[#52525B] mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-8 py-16 lg:py-24" data-testid="features-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#52525B] bg-[#A7F3D0] px-4 py-1.5 rounded-full border-2 border-[#09090B] shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] mb-4">Features</span>
            <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#09090B] mb-2">
              Everything you need to get hired
            </h2>
            <p className="text-[#52525B] text-base sm:text-lg">No design. No writing. Just answers.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="bg-[#FFFFFF] border-2 border-[#09090B] rounded-xl p-5 shadow-[5px_5px_0px_0px_rgba(9,9,11,1)] hover:translate-y-[-3px] hover:shadow-[7px_8px_0px_0px_rgba(9,9,11,1)] transition-all" data-testid={`feature-card-${i}`}>
                <div className={`w-11 h-11 ${f.color} border-2 border-[#09090B] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]`}>
                  <f.icon size={20} weight="bold" className="text-[#09090B]" />
                </div>
                <h3 className="font-['Outfit'] font-bold text-base mt-3 text-[#09090B]">{f.title}</h3>
                <p className="text-sm text-[#52525B] mt-1.5 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-8 py-16 lg:py-24 bg-[#FFFFFF] border-y-2 border-[#09090B]" data-testid="testimonials-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#52525B] bg-[#C4B5FD] px-4 py-1.5 rounded-full border-2 border-[#09090B] shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] mb-4">Testimonials</span>
            <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#09090B]">
              Real people. Real results.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#FAFAFA] border-2 border-[#09090B] rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] hover:translate-y-[-2px] transition-all" data-testid={`testimonial-card-${i}`}>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} weight="fill" className="text-[#FDE047]" />)}
                </div>
                <p className="text-sm text-[#09090B] font-medium leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#E4E4E7]">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full border-2 border-[#09090B] object-cover" />
                  <div>
                    <p className="font-bold text-sm text-[#09090B]">{t.name}</p>
                    <p className="text-xs text-[#52525B]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing Hook */}
      <section className="px-4 sm:px-8 py-16 lg:py-20 bg-[#09090B]" data-testid="marketing-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Outfit'] font-black text-2xl sm:text-3xl lg:text-4xl text-[#FDE047] mb-3">
            Create 10 resumes for 10 companies in 10 minutes
          </h2>
          <p className="text-base sm:text-lg text-white/70 mb-4">
            Increase your chances of getting shortlisted by 3X
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {["LinkedIn Import", "AI Writing", "10 Templates", "ATS Score", "Cover Letters", "PDF Export", "Share Links"].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-8 py-16 lg:py-24" data-testid="cta-section">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#09090B] mb-4">
            Make HR say YES in 6 seconds
          </h2>
          <p className="text-base sm:text-lg text-[#52525B] mb-8 max-w-xl mx-auto">
            Stop spending hours on resumes. Just answer a few questions and let AI do the rest.
          </p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="neo-btn inline-flex items-center gap-2 px-8 py-4 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold text-lg shadow-[6px_6px_0px_0px_rgba(9,9,11,1)]"
            data-testid="cta-button"
          >
            Get Started Free <Rocket size={22} weight="bold" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[#09090B] px-4 sm:px-8 py-8 bg-[#FFFFFF]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FDE047] border-2 border-[#09090B] rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
              <FileText size={14} weight="bold" />
            </div>
            <span className="font-['Outfit'] font-black text-lg">ResumeAI</span>
          </div>
          <p className="text-sm text-[#52525B]">Built with AI. Made for getting hired.</p>
        </div>
      </footer>
    </div>
  );
}
