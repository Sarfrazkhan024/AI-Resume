import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatInterface from "../components/ChatInterface";
import ResumePreview from "../components/ResumePreview";
import { Eye, ChatCircle, DownloadSimple, Palette, ArrowLeft } from "@phosphor-icons/react";
import { toast } from "sonner";

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

          {resume?.status === "complete" && (
            <button onClick={handleDownload} className="neo-btn flex items-center gap-1 px-3 py-1.5 bg-[#A7F3D0] border-2 border-[#09090B] rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" data-testid="download-pdf-btn">
              <DownloadSimple size={14} weight="bold" /> PDF
            </button>
          )}

          {/* Mobile toggle */}
          <div className="flex md:hidden border-2 border-[#09090B] rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            <button onClick={() => setMobileView("chat")} className={`p-2 ${mobileView === "chat" ? "bg-[#FDE047]" : "bg-[#FFFFFF]"}`} data-testid="mobile-chat-toggle">
              <ChatCircle size={16} weight="bold" />
            </button>
            <button onClick={() => setMobileView("preview")} className={`p-2 ${mobileView === "preview" ? "bg-[#FDE047]" : "bg-[#FFFFFF]"}`} data-testid="mobile-preview-toggle">
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
          <div className="p-4 lg:p-8 flex-1 flex items-start justify-center">
            <div className="w-full max-w-[600px]">
              <ResumePreview resume={resume} template={template} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
