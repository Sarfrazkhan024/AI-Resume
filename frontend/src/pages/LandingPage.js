import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lightning, ChatCircle, FileText, ArrowRight, Star, Checks, Users, Rocket } from "@phosphor-icons/react";

const features = [
  { icon: ChatCircle, title: "Chat-based Builder", desc: "Answer simple questions like texting a friend. No resume skills needed.", color: "bg-[#A7F3D0]" },
  { icon: Lightning, title: "AI-Powered Writing", desc: "GPT-4o rewrites your answers into professional, ATS-friendly resume language.", color: "bg-[#FDE047]" },
  { icon: FileText, title: "Job-Specific Resumes", desc: "Different resume for each company. Match the job description perfectly.", color: "bg-[#C4B5FD]" },
  { icon: Checks, title: "ATS Optimized", desc: "Smart keyword suggestions ensure your resume passes automated screening.", color: "bg-[#FDE047]" },
  { icon: Star, title: "Premium Templates", desc: "Clean, modern designs that make HR say YES in 6 seconds.", color: "bg-[#A7F3D0]" },
  { icon: Rocket, title: "Ready in 5 Minutes", desc: "From zero to job-ready resume. Faster than ordering food online.", color: "bg-[#C4B5FD]" },
];

const steps = [
  { num: "01", title: "Tell us the job", desc: "Select your target role and company" },
  { num: "02", title: "Answer questions", desc: "Simple chat - like talking to a friend" },
  { num: "03", title: "Download resume", desc: "AI creates your perfect resume instantly" },
];

const testimonials = [
  { name: "Priya S.", role: "Fresher, Pune", text: "Got 3 interview calls in the first week after using ResumeAI. My college friends couldn't believe it!", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" },
  { name: "Rahul K.", role: "Job Switcher, Delhi", text: "Made 5 different resumes for 5 companies in 10 minutes. Each one tailored perfectly. This is magic!", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=200&auto=format&fit=crop" },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-8 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] border-2 border-[#09090B] rounded-full shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] mb-8 animate-slide-up" data-testid="hero-badge">
            <Lightning size={16} weight="fill" className="text-[#FDE047]" />
            <span className="text-sm font-bold">5-minute resume promise</span>
          </div>

          <h1 className="font-['Outfit'] font-black text-4xl sm:text-5xl lg:text-6xl text-[#09090B] tracking-tight leading-none animate-slide-up stagger-1" data-testid="hero-title">
            Stop struggling with resumes.
            <br />
            <span className="gradient-text">Just answer questions.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#52525B] max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-2" data-testid="hero-subtitle">
            One profile. Multiple resumes. Different jobs. Higher chances.
            <br className="hidden sm:block" />
            Your resume should match the job - not be the same everywhere.
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

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[#52525B] animate-slide-up stagger-4">
            <div className="flex items-center gap-1"><Users size={16} weight="bold" /><span className="font-bold">10,000+</span> resumes created</div>
            <div className="flex items-center gap-1"><Star size={16} weight="fill" className="text-[#FDE047]" /><span className="font-bold">4.9/5</span> rating</div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-8 w-12 h-12 bg-[#FDE047] border-2 border-[#09090B] rounded-lg shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] rotate-12 hidden lg:block" />
        <div className="absolute top-40 right-12 w-8 h-8 bg-[#A7F3D0] border-2 border-[#09090B] rounded-full shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] hidden lg:block" />
        <div className="absolute bottom-20 left-16 w-6 h-6 bg-[#C4B5FD] border-2 border-[#09090B] rounded-lg shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] -rotate-12 hidden lg:block" />
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-8 py-16 lg:py-24 bg-[#FFFFFF] border-y-2 border-[#09090B]" data-testid="how-it-works">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl text-center text-[#09090B] mb-12">
            3 steps. 5 minutes. Job-ready.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="bg-[#FFFFFF] border-2 border-[#09090B] rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] relative" data-testid={`step-card-${i}`}>
                <span className="font-['Outfit'] font-black text-5xl text-[#FDE047]">{step.num}</span>
                <h3 className="font-['Outfit'] font-bold text-xl mt-2 text-[#09090B]">{step.title}</h3>
                <p className="text-sm text-[#52525B] mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-8 py-16 lg:py-24" data-testid="features-section">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl text-center text-[#09090B] mb-4">
            Everything you need to get hired
          </h2>
          <p className="text-center text-[#52525B] mb-12 text-base sm:text-lg">No design. No writing. Just answers.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-[#FFFFFF] border-2 border-[#09090B] rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(9,9,11,1)] transition-all" data-testid={`feature-card-${i}`}>
                <div className={`w-12 h-12 ${f.color} border-2 border-[#09090B] rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]`}>
                  <f.icon size={22} weight="bold" className="text-[#09090B]" />
                </div>
                <h3 className="font-['Outfit'] font-bold text-lg mt-4 text-[#09090B]">{f.title}</h3>
                <p className="text-sm text-[#52525B] mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-8 py-16 lg:py-24 bg-[#FFFFFF] border-y-2 border-[#09090B]" data-testid="testimonials-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl text-center text-[#09090B] mb-12">
            Real people. Real results.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#FAFAFA] border-2 border-[#09090B] rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)]" data-testid={`testimonial-card-${i}`}>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} weight="fill" className="text-[#FDE047]" />)}
                </div>
                <p className="text-sm text-[#09090B] font-medium italic">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-4">
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

      {/* CTA */}
      <section className="px-4 sm:px-8 py-16 lg:py-24" data-testid="cta-section">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#09090B] mb-4">
            Make HR say YES in 6 seconds
          </h2>
          <p className="text-base sm:text-lg text-[#52525B] mb-8">
            Create 10 resumes for 10 companies in 10 minutes. Increase your chances by 3X.
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
