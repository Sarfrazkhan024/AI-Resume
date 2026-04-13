import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Plus, FileText, Copy, Trash, DownloadSimple, PencilSimple, Briefcase, Crown } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [company, setCompany] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await axios.get(`${API}/resumes/`, { withCredentials: true });
      setResumes(data);
    } catch (err) {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!jobRole.trim()) return;
    setCreating(true);
    try {
      const { data } = await axios.post(`${API}/chat/start`, { job_role: jobRole.trim(), company: company.trim() }, { withCredentials: true });
      navigate(`/builder/${data.session.id}`);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 403) {
        toast.error(typeof detail === "string" ? detail : "Upgrade to Pro for unlimited resumes!");
        navigate("/pricing");
      } else {
        toast.error(typeof detail === "string" ? detail : "Failed to create resume");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await axios.post(`${API}/resumes/${id}/duplicate`, {}, { withCredentials: true });
      toast.success("Resume duplicated!");
      fetchResumes();
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 403) {
        toast.error(typeof detail === "string" ? detail : "Upgrade to Pro!");
        navigate("/pricing");
      } else {
        toast.error("Failed to duplicate");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await axios.delete(`${API}/resumes/${id}`, { withCredentials: true });
      toast.success("Resume deleted");
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const response = await axios.get(`${API}/resumes/${id}/download-pdf`, { withCredentials: true, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name || "resume"}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]" data-testid="dashboard-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-['Outfit'] font-bold text-2xl sm:text-3xl text-[#09090B]" data-testid="dashboard-title">
              Hey {user?.name?.split(" ")[0]}! 
            </h1>
            <p className="text-sm text-[#52525B] mt-1">Manage your resumes and create new ones</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="neo-btn flex items-center gap-2 px-6 py-3 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]"
            data-testid="create-resume-btn"
          >
            <Plus size={18} weight="bold" /> New Resume
          </button>
        </div>

        {/* Resumes Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FDE047] animate-bounce" style={{animationDelay:"0s"}} />
              <div className="w-3 h-3 rounded-full bg-[#A7F3D0] animate-bounce" style={{animationDelay:"0.15s"}} />
              <div className="w-3 h-3 rounded-full bg-[#C4B5FD] animate-bounce" style={{animationDelay:"0.3s"}} />
            </div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-state">
            <div className="w-20 h-20 bg-[#FDE047] border-2 border-[#09090B] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(9,9,11,1)]">
              <FileText size={36} weight="bold" className="text-[#09090B]" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-xl text-[#09090B] mb-2">No resumes yet</h3>
            <p className="text-sm text-[#52525B] mb-6">Create your first job-ready resume in 5 minutes</p>
            <button
              onClick={() => setShowNewModal(true)}
              className="neo-btn inline-flex items-center gap-2 px-6 py-3 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]"
              data-testid="empty-create-btn"
            >
              <Plus size={18} weight="bold" /> Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="resumes-grid">
            {resumes.map((resume, i) => (
              <div key={resume.id} className="bg-[#FFFFFF] border-2 border-[#09090B] rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(9,9,11,1)] transition-all animate-slide-up" style={{animationDelay:`${i*0.1}s`}} data-testid={`resume-card-${i}`}>
                {/* Card header */}
                <div className="bg-[#1a1a2e] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} weight="bold" className="text-[#FDE047]" />
                    <span className="text-white font-bold text-sm truncate">{resume.title || "Untitled"}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold border-2 border-[#09090B] ${resume.status === "complete" ? "bg-[#A7F3D0]" : "bg-[#FDE047]"}`}>
                      {resume.status === "complete" ? "Complete" : "Draft"}
                    </span>
                    <span className="text-xs text-[#52525B]">{resume.template || "modern"}</span>
                  </div>
                  <p className="text-xs text-[#52525B] mb-4">
                    {resume.personal_info?.name && `${resume.personal_info.name} - `}
                    {resume.job_role}{resume.company ? ` at ${resume.company}` : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/builder/${resume.id}`, { state: { resumeId: resume.id } })} className="neo-btn flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#FDE047] border-2 border-[#09090B] rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" data-testid={`edit-resume-${i}`}>
                      <PencilSimple size={14} weight="bold" /> Edit
                    </button>
                    <button onClick={() => handleDownload(resume.id, resume.personal_info?.name)} className="neo-btn p-2 bg-[#A7F3D0] border-2 border-[#09090B] rounded-lg shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" title="Download PDF" data-testid={`download-resume-${i}`}>
                      <DownloadSimple size={14} weight="bold" />
                    </button>
                    <button onClick={() => handleDuplicate(resume.id)} className="neo-btn p-2 bg-[#C4B5FD] border-2 border-[#09090B] rounded-lg shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" title="Duplicate" data-testid={`duplicate-resume-${i}`}>
                      <Copy size={14} weight="bold" />
                    </button>
                    <button onClick={() => handleDelete(resume.id)} className="neo-btn p-2 bg-[#FDA4AF] border-2 border-[#09090B] rounded-lg shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" title="Delete" data-testid={`delete-resume-${i}`}>
                      <Trash size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Plan banner */}
        {user?.plan === "free" && resumes.length > 0 && (
          <div className="mt-8 bg-[#FFFFFF] border-2 border-[#09090B] rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] flex flex-col sm:flex-row items-center gap-4" data-testid="upgrade-banner">
            <div className="w-12 h-12 bg-[#C4B5FD] border-2 border-[#09090B] rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] flex-shrink-0">
              <Crown size={22} weight="bold" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-['Outfit'] font-bold text-lg text-[#09090B]">Upgrade to Pro</h3>
              <p className="text-sm text-[#52525B]">Unlimited resumes, premium templates, and AI optimization for every job</p>
            </div>
            <button onClick={() => navigate("/pricing")} className="neo-btn px-6 py-3 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]" data-testid="upgrade-btn">
              Upgrade Now
            </button>
          </div>
        )}
      </div>

      {/* New Resume Modal */}
      <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
        <DialogContent className="border-2 border-[#09090B] shadow-[8px_8px_0px_0px_rgba(9,9,11,1)] rounded-xl max-w-md" data-testid="new-resume-modal">
          <DialogHeader>
            <DialogTitle className="font-['Outfit'] font-bold text-xl">Create New Resume</DialogTitle>
            <DialogDescription className="text-sm text-[#52525B]">Enter the job role you're targeting to get started</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-bold text-[#09090B] mb-1 block">Job Role *</label>
              <input
                type="text" value={jobRole} onChange={e => setJobRole(e.target.value)}
                placeholder="e.g. Software Engineer, Marketing Manager"
                className="w-full bg-[#FAFAFA] border-2 border-[#09090B] rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#C4B5FD] shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]"
                data-testid="job-role-input"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[#09090B] mb-1 block">Company (optional)</label>
              <input
                type="text" value={company} onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Google, Infosys, Zomato"
                className="w-full bg-[#FAFAFA] border-2 border-[#09090B] rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#C4B5FD] shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]"
                data-testid="company-input"
              />
            </div>
            <button
              onClick={handleCreate} disabled={!jobRole.trim() || creating}
              className="neo-btn w-full px-6 py-3 bg-[#FDE047] text-[#09090B] border-2 border-[#09090B] rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] disabled:opacity-50"
              data-testid="start-building-btn"
            >
              {creating ? "Starting..." : "Start Building"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
