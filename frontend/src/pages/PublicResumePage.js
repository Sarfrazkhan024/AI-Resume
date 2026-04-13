import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ResumePreview from "../components/ResumePreview";
import { FileText, ArrowRight } from "@phosphor-icons/react";

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FDE047] animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="w-3 h-3 rounded-full bg-[#A7F3D0] animate-bounce" style={{ animationDelay: "0.15s" }} />
        <div className="w-3 h-3 rounded-full bg-[#C4B5FD] animate-bounce" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4" data-testid="public-resume-error">
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
    <div className="min-h-screen bg-[#E4E4E7]/30" data-testid="public-resume-page">
      {/* Header bar */}
      <div className="sticky top-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-sm border-b-2 border-[#09090B] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FDE047] border-2 border-[#09090B] rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
              <FileText size={14} weight="bold" />
            </div>
            <span className="font-['Outfit'] font-black text-lg">ResumeAI</span>
          </Link>
          <Link to="/register" className="neo-btn px-4 py-2 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full text-sm font-bold shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]" data-testid="create-own-btn">
            Create Yours Free
          </Link>
        </div>
      </div>

      {/* Resume */}
      <div className="max-w-[700px] mx-auto p-4 sm:p-8">
        <div className="mb-4 text-center">
          <h1 className="font-['Outfit'] font-bold text-lg text-[#09090B]">{resume?.personal_info?.name || "Resume"}</h1>
          <p className="text-sm text-[#52525B]">{resume?.job_role}{resume?.company ? ` at ${resume.company}` : ""}</p>
        </div>
        <ResumePreview resume={resume} template={resume?.template || "modern"} />
      </div>
    </div>
  );
}
