# ResumeAI - Product Requirements Document

## Original Problem Statement
Build a modern, mobile-first web platform called "ResumeAI" that helps users create highly customized, job-specific resumes in under 5 minutes.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI + Phosphor Icons
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **AI**: OpenAI GPT-4o via Emergent LLM Key
- **PDF**: ReportLab
- **Payments**: Razorpay (MOCKED - needs real keys)
- **Auth**: JWT httpOnly cookies + Emergent Google OAuth

## What's Been Implemented

### Phase 1 (April 13, 2026)
- [x] Landing page with conversion-focused copy
- [x] JWT auth (register/login/logout)
- [x] Chat-based resume builder (11-step flow)
- [x] AI text optimization via GPT-4o
- [x] Live resume preview (split-screen)
- [x] 3 resume templates (Modern, Classic, Minimal)
- [x] PDF download
- [x] Dashboard with CRUD operations
- [x] Resume duplication
- [x] Pricing page with 3 plans
- [x] Razorpay integration (MOCKED)
- [x] Free plan limits

### Phase 2 (April 13, 2026)
- [x] Google OAuth login (Emergent Auth)
- [x] Shareable resume links (public URL)
- [x] ATS resume scoring (GPT-4o analysis: score 0-100, section breakdown, suggestions, missing keywords)
- [x] Score/Share/Download buttons on builder toolbar and dashboard cards
- [x] Public resume page at /share/:shareId

### Phase 3 (April 13, 2026)
- [x] Cover Letter Generator (GPT-4o powered, personalized to job role + company)
- [x] Cover letter preview with Resume/Cover Letter tab toggle
- [x] Cover letter PDF download
- [x] Toolbar integration with dynamic button (Generate → Toggle → Download)

### Phase 4 (April 13, 2026)
- [x] Expanded to 8 premium templates (Modern, Classic, Minimal, Executive, Creative, Tech, Elegant, Bold)
- [x] Each template with distinct header colors, skill chip styles, section title accents
- [x] Inline section editing after resume completion (left panel switches from chat to editor)
- [x] Collapsible section cards for all 8 resume sections
- [x] Tag-style editing for skills, achievements, hobbies
- [x] Array item add/remove for education, experience, projects
- [x] Dirty state detection with Save button
- [x] Real-time preview updates after saving edits

## Prioritized Backlog

### P1 (Important)
- Real Razorpay keys for live payments
- Resume editing (inline edit sections after completion)
- Cover letter generator
- More premium templates (5-10 total)

### P2 (Nice to Have)
- WhatsApp login
- LinkedIn profile import
- AI mock interviews
- Job recommendations
- Resume analytics/tracking
- Recruiter marketplace
