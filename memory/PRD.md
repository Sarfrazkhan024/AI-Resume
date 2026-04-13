# ResumeAI - Product Requirements Document

## Original Problem Statement
Build a modern, mobile-first web platform called "ResumeAI" that helps users create highly customized, job-specific resumes in under 5 minutes. Features include conversational AI-powered resume building, real-time preview, multiple templates, PDF download, dashboard management, and Razorpay payment integration.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI + Phosphor Icons
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **AI**: OpenAI GPT-4o via Emergent LLM Key (emergentintegrations)
- **PDF**: ReportLab
- **Payments**: Razorpay (MOCKED - needs real keys)
- **Auth**: JWT httpOnly cookies (bcrypt + PyJWT)

## User Personas
1. **Freshers**: No resume experience, need guided help
2. **College Students**: Need multiple resumes for different companies
3. **Job Switchers**: Need professional language optimization
4. **Tier 2/3 City Users**: Need simple, mobile-first interface

## Core Requirements
- Chat-based conversational resume builder
- AI-powered text optimization (ATS-friendly)
- Real-time resume preview (split-screen)
- 3 templates: Modern, Classic, Minimal
- PDF download
- Dashboard to manage multiple resumes
- Freemium model (free: 1 resume, pro: unlimited)
- One-click resume duplication

## What's Been Implemented (April 13, 2026)
- [x] Landing page with conversion-focused copy
- [x] JWT auth (register/login/logout)
- [x] Admin seeding
- [x] Chat-based resume builder (11-step flow)
- [x] AI text optimization via GPT-4o
- [x] Live resume preview (split-screen desktop, toggle mobile)
- [x] 3 resume templates
- [x] PDF download (ReportLab)
- [x] Dashboard with CRUD operations
- [x] Resume duplication
- [x] Pricing page with 3 plans
- [x] Razorpay integration (MOCKED)
- [x] Free plan limits (1 resume)
- [x] Mobile-responsive design
- [x] Neo-Brutalist UI design

## Prioritized Backlog

### P0 (Critical)
- None remaining for MVP

### P1 (Important)
- Google OAuth integration
- Real Razorpay keys integration
- Resume sharing via link
- Resume scoring/ATS score
- Cover letter generator

### P2 (Nice to Have)
- WhatsApp login
- LinkedIn profile import
- AI mock interviews
- Job recommendations
- Recruiter marketplace
- Resume analytics/tracking

## Next Tasks
1. Add real Razorpay keys for live payments
2. Google OAuth login
3. Resume shareable link feature
4. Resume ATS scoring
5. More premium templates
