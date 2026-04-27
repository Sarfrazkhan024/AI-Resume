import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  ArrowRight, Star, Lightning, ChatCircle, FileText, Checks,
  Palette, ChartBar, Envelope, LinkedinLogo, ShareNetwork,
  MagnifyingGlass, Robot, UserCircle, ArrowDown, Sparkle
} from "@phosphor-icons/react";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" } }) };

function ProductMockup() {
  return (
    <div className="relative w-full max-w-[640px] mx-auto" data-testid="hero-mockup">
      {/* Browser chrome */}
      <div className="rounded-2xl border border-[#E5E7EB] shadow-2xl overflow-hidden bg-white">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E5E7EB]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FDA4AF]" />
            <div className="w-3 h-3 rounded-full bg-[#FDE047]" />
            <div className="w-3 h-3 rounded-full bg-[#86EFAC]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white border border-[#E5E7EB] rounded-lg px-4 py-1 text-[10px] text-[#6B7280] font-mono">resumeai.com/builder</div>
          </div>
        </div>
        {/* App content */}
        <div className="flex h-[320px] sm:h-[360px]">
          {/* Left: Chat */}
          <div className="w-[45%] border-r border-[#E5E7EB] flex flex-col bg-[#FAFAFA]">
            <div className="px-3 py-2 border-b border-[#E5E7EB] bg-white">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#86EFAC]" />
                <span className="text-[9px] font-bold text-[#09090B]">AI Resume Builder</span>
              </div>
            </div>
            <div className="flex-1 p-2.5 space-y-2 overflow-hidden">
              {/* AI message */}
              <div className="flex gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#C4B5FD] flex items-center justify-center flex-shrink-0"><Robot size={10} weight="bold" className="text-white" /></div>
                <div className="bg-white border border-[#E5E7EB] rounded-lg rounded-tl-sm px-2.5 py-1.5 max-w-[85%]">
                  <p className="text-[8px] text-[#09090B] leading-tight">What are your key skills? Include technical and soft skills.</p>
                </div>
              </div>
              {/* User message */}
              <div className="flex gap-1.5 justify-end">
                <div className="bg-[#A7F3D0] border border-[#86EFAC] rounded-lg rounded-tr-sm px-2.5 py-1.5 max-w-[85%]">
                  <p className="text-[8px] text-[#09090B] leading-tight">Python, React, AWS, team leadership, problem solving</p>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#FDE047] flex items-center justify-center flex-shrink-0"><UserCircle size={10} weight="bold" /></div>
              </div>
              {/* AI response */}
              <div className="flex gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#C4B5FD] flex items-center justify-center flex-shrink-0"><Robot size={10} weight="bold" className="text-white" /></div>
                <div className="bg-white border border-[#E5E7EB] rounded-lg rounded-tl-sm px-2.5 py-1.5 max-w-[85%]">
                  <p className="text-[8px] text-[#09090B] leading-tight">Great skills! Now tell me about your work experience.</p>
                </div>
              </div>
              {/* Typing indicator */}
              <div className="flex gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#C4B5FD] flex items-center justify-center flex-shrink-0"><Robot size={10} weight="bold" className="text-white" /></div>
                <div className="bg-white border border-[#E5E7EB] rounded-lg rounded-tl-sm px-2.5 py-1.5">
                  <div className="flex gap-1"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></div>
                </div>
              </div>
            </div>
            {/* Input */}
            <div className="p-2 border-t border-[#E5E7EB] bg-white">
              <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-[8px] text-[#A1A1AA]">Type your answer...</div>
            </div>
          </div>

          {/* Right: Resume preview */}
          <div className="w-[55%] bg-[#F3F4F6] p-3 overflow-hidden flex items-start justify-center">
            <div className="bg-white rounded-sm shadow-lg w-full border border-[#E5E7EB] text-[7px] leading-tight">
              <div className="bg-[#0f172a] text-white px-3 py-2.5">
                <div className="font-bold text-[10px]">Sarah Johnson</div>
                <div className="text-[7px] opacity-70 mt-0.5">Senior Software Engineer</div>
                <div className="text-[6px] opacity-50 mt-1">sarah@email.com | +1-555-0123 | San Francisco</div>
              </div>
              <div className="p-3 space-y-2">
                <div>
                  <div className="font-bold text-[7px] text-[#0f172a] border-b border-[#0f172a] pb-0.5 mb-1 uppercase tracking-wider">Summary</div>
                  <div className="text-[6px] text-[#555]">Results-driven software engineer with 6+ years building scalable applications...</div>
                </div>
                <div>
                  <div className="font-bold text-[7px] text-[#0f172a] border-b border-[#0f172a] pb-0.5 mb-1 uppercase tracking-wider">Skills</div>
                  <div className="flex flex-wrap gap-0.5">
                    {["Python", "React", "AWS", "Node.js", "SQL", "Docker"].map((s, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-[#F5F3FF] border border-[#C4B5FD] rounded-full text-[5px] text-[#1a1a2e]">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[7px] text-[#0f172a] border-b border-[#0f172a] pb-0.5 mb-1 uppercase tracking-wider">Experience</div>
                  <div className="text-[6px]"><span className="font-bold">Sr. Software Engineer</span> - Google (2021-Present)</div>
                  <div className="text-[5px] text-[#888] mt-0.5">Led microservices platform serving 50M+ users...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating badge */}
      <div className="absolute -bottom-4 -right-4 bg-[#FDE047] border-2 border-[#09090B] rounded-xl px-3 py-2 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] animate-bounce" style={{ animationDuration: "3s" }}>
        <div className="flex items-center gap-1.5">
          <Sparkle size={14} weight="fill" className="text-[#09090B]" />
          <span className="text-xs font-bold text-[#09090B]">AI Powered</span>
        </div>
      </div>
    </div>
  );
}

const bentoFeatures = [
  { title: "ATS Score Check", desc: "AI rates your resume 0-100 and tells you exactly what to fix", icon: ChartBar, span: "md:col-span-8 md:row-span-2", color: "bg-[#FDE047]", size: "large" },
  { title: "AI Cover Letters", desc: "One-click personalized cover letters for every application", icon: Envelope, span: "md:col-span-4 md:row-span-2", color: "bg-[#C4B5FD]", size: "tall" },
  { title: "10 Templates", desc: "From minimal to bold", icon: Palette, span: "md:col-span-4", color: "bg-[#A7F3D0]" },
  { title: "Share Links", desc: "One-click shareable URLs", icon: ShareNetwork, span: "md:col-span-4", color: "bg-[#FDE047]" },
  { title: "Job Matches", desc: "AI-powered recommendations", icon: MagnifyingGlass, span: "md:col-span-4", color: "bg-[#C4B5FD]" },
  { title: "LinkedIn Import", desc: "Upload PDF, get a resume", icon: LinkedinLogo, span: "md:col-span-6", color: "bg-[#A7F3D0]" },
  { title: "Chat Builder", desc: "Answer questions like texting", icon: ChatCircle, span: "md:col-span-6", color: "bg-[#FDE047]" },
];

const testimonials = [
  { name: "Priya S.", role: "Fresher, Pune", text: "Got 3 interview calls in the first week. The AI rewrote my experience section and it sounded incredible!", img: "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?auto=format&fit=crop&w=200&q=80" },
  { name: "Rahul K.", role: "Job Switcher, Delhi", text: "Made 5 different resumes for 5 companies in 10 minutes. Each one tailored perfectly. This is magic!", img: "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?auto=format&fit=crop&w=200&q=80" },
  { name: "Ananya M.", role: "Student, Bangalore", text: "The ATS score feature showed me my resume was only 45/100. After AI optimization, it jumped to 89. Got shortlisted everywhere!", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
];

const stats = [
  { value: "10,000+", label: "Resumes Created" },
  { value: "3X", label: "More Interviews" },
  { value: "5 min", label: "Average Time" },
  { value: "89/100", label: "Avg ATS Score" },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FFFFFF]" style={{ fontFamily: "'Manrope', 'DM Sans', sans-serif" }}>

      {/* ===== HERO ===== */}
      <section className="relative px-4 sm:px-8 pt-12 pb-8 lg:pt-20 lg:pb-16 overflow-hidden" data-testid="hero-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div initial="hidden" animate="visible" className="text-left">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-full mb-6" data-testid="hero-badge">
                <Lightning size={14} weight="fill" className="text-[#FDE047]" />
                <span className="text-xs font-semibold text-[#6B7280]">AI-Powered Resume Builder</span>
              </motion.div>

              <motion.h1 variants={fadeUp} custom={1} className="font-['Outfit'] font-black text-4xl sm:text-5xl lg:text-[3.5rem] text-[#0A0A0A] tracking-tighter leading-[1.05]" data-testid="hero-title">
                Your resume should
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0055FF] to-[#7c3aed]">get you hired.</span>
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} className="mt-5 text-base sm:text-lg text-[#6B7280] max-w-lg leading-relaxed" data-testid="hero-subtitle">
                Answer simple questions. AI writes your resume in professional language. Job-specific, ATS-optimized, ready in 5 minutes.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-start gap-3 mt-8">
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className="group flex items-center gap-2 px-7 py-3.5 bg-[#0A0A0A] text-white rounded-full font-bold text-sm hover:bg-[#0A0A0A]/90 transition-all shadow-lg hover:shadow-xl"
                  data-testid="hero-cta"
                >
                  Create Your Resume Free
                  <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="text-xs text-[#A1A1AA] font-medium mt-2 sm:mt-3">No credit card required</span>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-6 mt-10 pt-8 border-t border-[#E5E7EB]">
                {stats.map((s, i) => (
                  <div key={i} className="text-center sm:text-left">
                    <div className="font-['Outfit'] font-black text-xl sm:text-2xl text-[#0A0A0A]">{s.value}</div>
                    <div className="text-[10px] sm:text-xs text-[#6B7280] font-medium">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Product Mockup */}
            <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}>
              <ProductMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="px-4 sm:px-8 py-16 lg:py-24 bg-[#FAFAFA]" data-testid="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="uppercase text-[10px] font-bold tracking-[0.2em] text-[#6B7280]">How it works</span>
            <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#0A0A0A] tracking-tight mt-3">Three steps to your dream job</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Tell us the job", desc: "Select your target role and company. Or import from LinkedIn.", icon: MagnifyingGlass },
              { num: "02", title: "Chat with AI", desc: "Answer simple questions. AI transforms your answers into professional resume language.", icon: ChatCircle },
              { num: "03", title: "Download & apply", desc: "Pick a template, download PDF, get your ATS score, and start applying.", icon: FileText },
            ].map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={i}
                className="relative bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg hover:border-[#0055FF]/20 transition-all" data-testid={`step-card-${i}`}>
                <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] flex items-center justify-center mb-4">
                  <step.icon size={20} weight="bold" className="text-[#FDE047]" />
                </div>
                <span className="font-['Outfit'] font-black text-4xl text-[#F3F4F6]">{step.num}</span>
                <h3 className="font-['Outfit'] font-bold text-lg text-[#0A0A0A] mt-1">{step.title}</h3>
                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENTO FEATURE GRID ===== */}
      <section className="px-4 sm:px-8 py-16 lg:py-24" data-testid="features-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="uppercase text-[10px] font-bold tracking-[0.2em] text-[#6B7280]">Features</span>
            <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#0A0A0A] tracking-tight mt-3">Everything you need to get hired</h2>
            <p className="text-base text-[#6B7280] mt-3">No design skills. No writing skills. Just answers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {bentoFeatures.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }} variants={fadeUp} custom={i * 0.5}
                className={`${f.span} bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg hover:border-[#0055FF]/20 transition-all group`} data-testid={`bento-feature-${i}`}>
                <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-3`}>
                  <f.icon size={20} weight="bold" className="text-[#0A0A0A]" />
                </div>
                <h3 className={`font-['Outfit'] font-bold text-[#0A0A0A] ${f.size === "large" ? "text-xl" : "text-base"}`}>{f.title}</h3>
                <p className={`text-[#6B7280] mt-1.5 leading-relaxed ${f.size === "large" ? "text-sm max-w-md" : "text-xs"}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="px-4 sm:px-8 py-16 lg:py-24 bg-[#FAFAFA]" data-testid="testimonials-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="uppercase text-[10px] font-bold tracking-[0.2em] text-[#6B7280]">Testimonials</span>
            <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#0A0A0A] tracking-tight mt-3">Real people. Real results.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all" data-testid={`testimonial-card-${i}`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} weight="fill" className="text-[#FDE047]" />)}
                </div>
                <p className="text-sm text-[#0A0A0A] font-medium leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[#E5E7EB]">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]" />
                  <div>
                    <p className="font-bold text-sm text-[#0A0A0A]">{t.name}</p>
                    <p className="text-xs text-[#6B7280]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DARK CTA ===== */}
      <section className="px-4 sm:px-8 py-20 lg:py-28 bg-[#0A0A0A]" data-testid="dark-cta-section">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-['Outfit'] font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tighter leading-tight">
              Make HR say YES
              <br />
              <span className="text-[#FDE047]">in 6 seconds.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/60 max-w-lg mx-auto">
              Create 10 resumes for 10 companies in 10 minutes. Increase your shortlist rate by 3X.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="group flex items-center gap-2 px-8 py-4 bg-[#FDE047] text-[#0A0A0A] rounded-full font-bold text-base hover:bg-[#FEF08A] transition-all shadow-lg"
                data-testid="dark-cta-button"
              >
                Get Started Free <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-sm text-white/40">No credit card required</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-4 sm:px-8 py-8 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
              <FileText size={14} weight="bold" className="text-[#FDE047]" />
            </div>
            <span className="font-['Outfit'] font-black text-lg text-[#0A0A0A]">ResumeAI</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#6B7280]">
            <Link to="/pricing" className="hover:text-[#0A0A0A] transition-colors">Pricing</Link>
            <Link to="/login" className="hover:text-[#0A0A0A] transition-colors">Log In</Link>
            <Link to="/register" className="hover:text-[#0A0A0A] transition-colors font-bold text-[#0A0A0A]">Sign Up Free</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
