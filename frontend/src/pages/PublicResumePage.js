import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ResumePreview from "../components/ResumePreview";
import { FileText, ArrowRight, DownloadSimple, Rocket } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Toaster } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PublicResumePage() {
  const { shareId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API}/public/resume/${shareId}`);
        setResume(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [shareId]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(`${API}/public/resume/${shareId}/download-pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume?.personal_info?.name || "resume"}_resume.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Resume downloaded!");
    } catch {
      toast.error("Download failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <Toaster position="top-right" richColors closeButton />
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FDE047] animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="w-3 h-3 rounded-full bg-[#A7F3D0] animate-bounce" style={{ animationDelay: "0.15s" }} />
        <div className="w-3 h-3 rounded-full bg-[#C4B5FD] animate-bounce" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4" data-testid="public-resume-error">
      <Toaster position="top-right" richColors closeButton />
      <div className="text-center">
        <div className="w-16 h-16 bg-[#FDA4AF] border-2 border-[#09090B] rounded-xl mx-auto mb-4 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
          <FileText size={28} weight="bold" />
        </div>
        <h2 className="font-['Outfit'] font-bold text-xl text-[#09090B] mb-2">Resume not found</h2>
        <p className="text-sm text-[#52525B] mb-6">This link may be invalid or expired</p>
        <Link to="/" className="neo-btn inline-flex items-center gap-2 px-6 py-3 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]" data-testid="go-home-btn">
          Create Your Own <ArrowRight size={18} weight="bold" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E4E4E7]/20" data-testid="public-resume-page">
      <Toaster position="top-right" richColors closeButton />
      {/* Header bar */}
      <div className="sticky top-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-sm border-b-2 border-[#09090B] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FDE047] border-2 border-[#09090B] rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
              <FileText size={14} weight="bold" />
            </div>
            <span className="font-['Outfit'] font-black text-lg">ResumeAI</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="neo-btn flex items-center gap-1.5 px-4 py-2 bg-[#A7F3D0] text-[#09090B] border-2 border-[#09090B] rounded-full text-sm font-bold shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]"
              data-testid="public-download-btn"
            >
              <DownloadSimple size={16} weight="bold" /> Download PDF
            </button>
            <Link to="/register" className="neo-btn flex items-center gap-1.5 px-4 py-2 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full text-sm font-bold shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]" data-testid="create-own-btn">
              <Rocket size={16} weight="bold" /> Create Yours
            </Link>
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="max-w-[700px] mx-auto p-4 sm:p-8">
        <div className="mb-6 text-center animate-slide-up">
          <h1 className="font-['Outfit'] font-bold text-xl text-[#09090B]">{resume?.personal_info?.name || "Resume"}</h1>
          <p className="text-sm text-[#52525B] mt-1">{resume?.job_role}{resume?.company ? ` at ${resume.company}` : ""}</p>
        </div>
        <div className="animate-slide-up stagger-1">
          <ResumePreview resume={resume} template={resume?.template || "modern"} />
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-[#FFFFFF] border-2 border-[#09090B] rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] text-center animate-slide-up stagger-2" data-testid="public-cta-banner">
          <p className="font-['Outfit'] font-bold text-lg text-[#09090B] mb-2">Want a resume like this?</p>
          <p className="text-sm text-[#52525B] mb-4">Create your own AI-powered, job-ready resume in 5 minutes</p>
          <Link to="/register" className="neo-btn inline-flex items-center gap-2 px-6 py-3 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
            Get Started Free <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
