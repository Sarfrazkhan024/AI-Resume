import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatInterface from "../components/ChatInterface";
import ResumePreview from "../components/ResumePreview";
import { Eye, ChatCircle, DownloadSimple, Palette, ArrowLeft, ShareNetwork, ChartBar, Envelope, SpinnerGap, FileText } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TEMPLATES = ["modern", "classic", "minimal"];

export default function ResumeBuilder() {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState("chat"); // "chat" or "preview"
  const [template, setTemplate] = useState("modern");
  const [showTemplates, setShowTemplates] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [previewTab, setPreviewTab] = useState("resume"); // "resume" or "cover_letter"
  const [coverLetter, setCoverLetter] = useState("");
  const [generatingCL, setGeneratingCL] = useState(false);

  // If navigated from dashboard with resumeId (existing resume), find session
  const resumeId = location.state?.resumeId;

  const loadSession = useCallback(async () => {
    try {
      // If we have a sessionId that's actually a resume ID, find the session
      let url = `${API}/chat/session/${sessionId}`;
      const { data } = await axios.get(url, { withCredentials: true });
      setSession(data.session);
      setResume(data.resume);
      setTemplate(data.resume?.template || "modern");
    } catch {
      // sessionId might be a resume ID - try to load it
      if (resumeId) {
        try {
          const { data } = await axios.get(`${API}/resumes/${resumeId}`, { withCredentials: true });
          setResume(data);
          setTemplate(data.template || "modern");
        } catch {
          toast.error("Resume not found");
          navigate("/dashboard");
        }
      } else {
        toast.error("Session not found");
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  }, [sessionId, resumeId, navigate]);

  useEffect(() => { loadSession(); }, [loadSession]);

  const handleSendMessage = async (message) => {
    if (!session) return;
    setSending(true);
    try {
      const { data } = await axios.post(`${API}/chat/message`, {
        session_id: session.id,
        message
      }, { withCredentials: true });
      setSession(data.session);
      setResume(data.resume);
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleTemplateChange = async (newTemplate) => {
    setTemplate(newTemplate);
    setShowTemplates(false);
    if (resume?.id) {
      try {
        await axios.put(`${API}/resumes/${resume.id}`, { template: newTemplate }, { withCredentials: true });
      } catch {}
    }
  };

  const handleDownload = async () => {
    if (!resume?.id) return;
    try {
      const response = await axios.get(`${API}/resumes/${resume.id}/download-pdf`, { withCredentials: true, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.personal_info?.name || "resume"}_resume.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to download PDF");
    }
  };

  const handleShare = async () => {
    if (!resume?.id) return;
    try {
      const { data } = await axios.post(`${API}/resumes/${resume.id}/share`, {}, { withCredentials: true });
      const shareUrl = `${window.location.origin}/share/${data.share_id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch {
      toast.error("Failed to generate share link");
    }
  };

  const handleScore = async () => {
    if (!resume?.id) return;
    setScoring(true);
    setShowScore(true);
    try {
      const { data } = await axios.post(`${API}/resumes/${resume.id}/score`, {}, { withCredentials: true });
      setScoreData(data);
    } catch {
      toast.error("Failed to score resume");
      setShowScore(false);
    } finally {
      setScoring(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!resume?.id) return;
    setGeneratingCL(true);
    try {
      const { data } = await axios.post(`${API}/resumes/${resume.id}/cover-letter`, {}, { withCredentials: true });
      setCoverLetter(data.cover_letter);
      setPreviewTab("cover_letter");
      toast.success("Cover letter generated!");
    } catch {
      toast.error("Failed to generate cover letter");
    } finally {
      setGeneratingCL(false);
    }
  };

  const handleDownloadCoverLetter = async () => {
    if (!resume?.id) return;
    try {
      const response = await axios.get(`${API}/resumes/${resume.id}/download-cover-letter-pdf`, { withCredentials: true, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.personal_info?.name || "cover_letter"}_cover_letter.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Cover letter PDF downloaded!");
    } catch {
      toast.error("No cover letter to download. Generate one first.");
    }
  };

  // Fetch existing cover letter when resume loads
  useEffect(() => {
    if (resume?.id && resume?.cover_letter) {
      setCoverLetter(resume.cover_letter);
    }
  }, [resume]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FDE047] animate-bounce" style={{animationDelay:"0s"}} />
          <div className="w-3 h-3 rounded-full bg-[#A7F3D0] animate-bounce" style={{animationDelay:"0.15s"}} />
          <div className="w-3 h-3 rounded-full bg-[#C4B5FD] animate-bounce" style={{animationDelay:"0.3s"}} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#FAFAFA]" data-testid="resume-builder-page">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-[#09090B] bg-[#FFFFFF]">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-[#E4E4E7] rounded-lg transition-all" data-testid="back-to-dashboard">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <span className="font-bold text-sm truncate max-w-[200px]">{resume?.title || "New Resume"}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Template selector */}
          <div className="relative">
            <button onClick={() => setShowTemplates(!showTemplates)} className="neo-btn flex items-center gap-1 px-3 py-1.5 bg-[#C4B5FD] border-2 border-[#09090B] rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" data-testid="template-selector-btn">
              <Palette size={14} weight="bold" /> {template}
            </button>
            {showTemplates && (
              <div className="absolute right-0 top-full mt-2 bg-[#FFFFFF] border-2 border-[#09090B] rounded-xl shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] z-50 overflow-hidden" data-testid="template-dropdown">
                {TEMPLATES.map(t => (
                  <button key={t} onClick={() => handleTemplateChange(t)} className={`w-full px-4 py-2 text-left text-sm font-bold hover:bg-[#FDE047]/30 transition-all ${t === template ? "bg-[#FDE047]" : ""}`} data-testid={`template-option-${t}`}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {resume && (
            <>
              <button onClick={handleScore} className="neo-btn flex items-center gap-1 px-3 py-1.5 bg-[#FDE047] border-2 border-[#09090B] rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" data-testid="ats-score-btn">
                <ChartBar size={14} weight="bold" /> Score
              </button>
              <button
                onClick={coverLetter ? () => setPreviewTab(previewTab === "cover_letter" ? "resume" : "cover_letter") : handleGenerateCoverLetter}
                disabled={generatingCL}
                className="neo-btn flex items-center gap-1 px-3 py-1.5 bg-[#C4B5FD] border-2 border-[#09090B] rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] disabled:opacity-50"
                data-testid="cover-letter-btn"
              >
                {generatingCL ? <SpinnerGap size={14} weight="bold" className="animate-spin" /> : <Envelope size={14} weight="bold" />}
                {generatingCL ? "Generating..." : coverLetter ? (previewTab === "cover_letter" ? "Resume" : "Cover Letter") : "Cover Letter"}
              </button>
              <button onClick={handleShare} className="neo-btn flex items-center gap-1 px-3 py-1.5 bg-[#FFFFFF] border-2 border-[#09090B] rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" data-testid="share-resume-btn">
                <ShareNetwork size={14} weight="bold" /> Share
              </button>
              <button onClick={previewTab === "cover_letter" ? handleDownloadCoverLetter : handleDownload} className="neo-btn flex items-center gap-1 px-3 py-1.5 bg-[#A7F3D0] border-2 border-[#09090B] rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" data-testid="download-pdf-btn">
                <DownloadSimple size={14} weight="bold" /> {previewTab === "cover_letter" ? "CL PDF" : "PDF"}
              </button>
            </>
          )}

          {/* Mobile toggle */}
          <div className="flex md:hidden border-2 border-[#09090B] rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            <button onClick={() => setMobileView("chat")} className={`p-2 ${mobileView === "chat" ? "bg-[#FDE047]" : "bg-[#FFFFFF]"}`} data-testid="mobile-chat-toggle">
              <ChatCircle size={16} weight="bold" />
            </button>
            <button onClick={() => { setMobileView("preview"); setPreviewTab("resume"); }} className={`p-2 ${mobileView === "preview" && previewTab === "resume" ? "bg-[#FDE047]" : "bg-[#FFFFFF]"}`} data-testid="mobile-preview-toggle">
              <Eye size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content - Split screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat panel */}
        <div className={`${mobileView === "chat" ? "flex" : "hidden"} md:flex flex-col w-full md:w-1/2 lg:w-[45%] border-r-0 md:border-r-2 border-[#09090B] bg-[#FAFAFA]`}>
          {session ? (
            <ChatInterface
              messages={session.messages || []}
              onSendMessage={handleSendMessage}
              currentStepIndex={session.current_step_index}
              completed={session.completed}
              loading={sending}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <p className="font-bold text-lg text-[#09090B]">Resume loaded in preview mode</p>
                <p className="text-sm text-[#52525B] mt-2">This resume was already completed. View it on the right.</p>
              </div>
            </div>
          )}
        </div>

        {/* Preview panel */}
        <div className={`${mobileView === "preview" ? "flex" : "hidden"} md:flex flex-col w-full md:w-1/2 lg:w-[55%] bg-[#E4E4E7]/30 overflow-y-auto`}>
          {/* Preview tab toggle */}
          {coverLetter && (
            <div className="flex items-center gap-1 px-4 pt-3" data-testid="preview-tabs">
              <button
                onClick={() => setPreviewTab("resume")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 border-[#09090B] transition-all ${previewTab === "resume" ? "bg-[#FDE047] shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" : "bg-[#FFFFFF]"}`}
                data-testid="preview-tab-resume"
              >
                <FileText size={12} weight="bold" className="inline mr-1" />Resume
              </button>
              <button
                onClick={() => setPreviewTab("cover_letter")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 border-[#09090B] transition-all ${previewTab === "cover_letter" ? "bg-[#C4B5FD] shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" : "bg-[#FFFFFF]"}`}
                data-testid="preview-tab-cover-letter"
              >
                <Envelope size={12} weight="bold" className="inline mr-1" />Cover Letter
              </button>
            </div>
          )}

          <div className="p-4 lg:p-8 flex-1 flex items-start justify-center">
            <div className="w-full max-w-[600px]">
              {previewTab === "cover_letter" && coverLetter ? (
                <div className="resume-paper border border-gray-200 rounded-sm overflow-hidden" data-testid="cover-letter-preview" style={{ fontSize: "12px", lineHeight: "1.7" }}>
                  <div className="bg-[#1a1a2e] px-6 py-4">
                    <h1 className="font-bold text-lg text-white tracking-tight">{resume?.personal_info?.name || "Your Name"}</h1>
                    <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-white/80">
                      {resume?.personal_info?.email && <span>{resume.personal_info.email}</span>}
                      {resume?.personal_info?.phone && <span>{resume.personal_info.phone}</span>}
                      {resume?.personal_info?.location && <span>{resume.personal_info.location}</span>}
                    </div>
                  </div>
                  <div className="px-6 py-5 space-y-3">
                    {coverLetter.split("\n").filter(l => l.trim()).map((para, i) => (
                      <p key={i} className="text-[11px] leading-relaxed text-[#333]">{para}</p>
                    ))}
                  </div>
                </div>
              ) : previewTab === "cover_letter" && !coverLetter ? (
                <div className="resume-paper border border-gray-200 rounded-sm flex items-center justify-center" data-testid="cover-letter-empty">
                  <div className="text-center px-8">
                    <div className="w-16 h-16 bg-[#C4B5FD] border-2 border-[#09090B] rounded-xl mx-auto mb-4 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
                      <Envelope size={28} weight="bold" />
                    </div>
                    <p className="font-['Outfit'] font-bold text-lg text-[#09090B]">No cover letter yet</p>
                    <p className="text-sm text-[#52525B] mt-1 mb-4">Click the button above to generate one with AI</p>
                    <button
                      onClick={handleGenerateCoverLetter}
                      disabled={generatingCL}
                      className="neo-btn inline-flex items-center gap-2 px-5 py-2.5 bg-[#C4B5FD] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold text-sm shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] disabled:opacity-50"
                      data-testid="generate-cover-letter-btn"
                    >
                      {generatingCL ? <SpinnerGap size={16} weight="bold" className="animate-spin" /> : <Envelope size={16} weight="bold" />}
                      {generatingCL ? "Generating..." : "Generate Cover Letter"}
                    </button>
                  </div>
                </div>
              ) : (
                <ResumePreview resume={resume} template={template} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ATS Score Modal */}
      <Dialog open={showScore} onOpenChange={setShowScore}>
        <DialogContent className="border-2 border-[#09090B] shadow-[8px_8px_0px_0px_rgba(9,9,11,1)] rounded-xl max-w-lg max-h-[80vh] overflow-y-auto" data-testid="ats-score-modal">
          <DialogHeader>
            <DialogTitle className="font-['Outfit'] font-bold text-xl">ATS Resume Score</DialogTitle>
            <DialogDescription className="text-sm text-[#52525B]">AI-powered analysis of your resume's ATS compatibility</DialogDescription>
          </DialogHeader>
          {scoring ? (
            <div className="py-8 flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FDE047] animate-bounce" style={{ animationDelay: "0s" }} />
                <div className="w-3 h-3 rounded-full bg-[#A7F3D0] animate-bounce" style={{ animationDelay: "0.15s" }} />
                <div className="w-3 h-3 rounded-full bg-[#C4B5FD] animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
              <p className="text-sm font-medium text-[#52525B]">AI is analyzing your resume...</p>
            </div>
          ) : scoreData ? (
            <div className="space-y-4 pt-2">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${
                  scoreData.score >= 80 ? "border-[#86EFAC] bg-[#86EFAC]/20" : scoreData.score >= 60 ? "border-[#FDE047] bg-[#FDE047]/20" : "border-[#FDA4AF] bg-[#FDA4AF]/20"
                }`} data-testid="ats-overall-score">
                  <span className="font-['Outfit'] font-black text-3xl text-[#09090B]">{scoreData.score}</span>
                </div>
                <p className="text-sm font-bold text-[#52525B] mt-2">out of 100</p>
              </div>

              {/* Section Scores */}
              {scoreData.sections && Object.entries(scoreData.sections).map(([key, val]) => (
                <div key={key} className="bg-[#FAFAFA] border-2 border-[#E4E4E7] rounded-xl p-3" data-testid={`score-section-${key}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#09090B] capitalize">{key}</span>
                    <span className={`text-sm font-bold ${val.score >= 80 ? "text-green-600" : val.score >= 60 ? "text-yellow-600" : "text-red-500"}`}>{val.score}/100</span>
                  </div>
                  <div className="w-full h-2 bg-[#E4E4E7] rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${val.score >= 80 ? "bg-[#86EFAC]" : val.score >= 60 ? "bg-[#FDE047]" : "bg-[#FDA4AF]"}`} style={{ width: `${val.score}%` }} />
                  </div>
                  {val.feedback && <p className="text-xs text-[#52525B]">{val.feedback}</p>}
                </div>
              ))}

              {/* Suggestions */}
              {scoreData.suggestions?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[#09090B] mb-2">Suggestions</h4>
                  <ul className="space-y-1">
                    {scoreData.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-[#52525B] flex gap-2">
                        <span className="text-[#FDE047] font-bold flex-shrink-0">-</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Keywords */}
              {scoreData.keywords_missing?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[#09090B] mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {scoreData.keywords_missing.map((kw, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-[#FDA4AF]/20 border border-[#FDA4AF] rounded-full text-[#09090B] font-medium">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
