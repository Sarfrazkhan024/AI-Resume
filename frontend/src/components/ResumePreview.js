import { MapPin, Envelope, Phone, GraduationCap, Briefcase, Lightbulb, Trophy, GameController, Star } from "@phosphor-icons/react";

const TEMPLATES = {
  modern: {
    headerBg: "bg-[#1a1a2e]",
    headerText: "text-white",
    accentColor: "border-[#FDE047]",
    sectionTitle: "text-[#1a1a2e] border-b-2 border-[#1a1a2e]",
  },
  classic: {
    headerBg: "bg-[#FFFFFF]",
    headerText: "text-[#09090B]",
    accentColor: "border-[#09090B]",
    sectionTitle: "text-[#09090B] border-b border-[#09090B]",
  },
  minimal: {
    headerBg: "bg-[#FAFAFA]",
    headerText: "text-[#09090B]",
    accentColor: "border-[#A7F3D0]",
    sectionTitle: "text-[#52525B] uppercase tracking-widest text-xs",
  },
};

function SectionTitle({ icon: Icon, title, template }) {
  const t = TEMPLATES[template] || TEMPLATES.modern;
  return (
    <div className={`flex items-center gap-2 pb-1 mb-2 ${t.sectionTitle}`}>
      {Icon && <Icon size={14} weight="bold" />}
      <span className="font-bold text-[11px] uppercase tracking-wider">{title}</span>
    </div>
  );
}

export default function ResumePreview({ resume, template = "modern" }) {
  if (!resume) return null;
  const t = TEMPLATES[template] || TEMPLATES.modern;
  const pi = resume.personal_info || {};
  const hasContent = pi.name || resume.summary || (resume.education && resume.education.length) || (resume.skills && resume.skills.length);

  if (!hasContent) {
    return (
      <div className="resume-paper border border-gray-200 rounded-sm flex items-center justify-center" data-testid="resume-preview-empty">
        <div className="text-center px-8">
          <div className="w-16 h-16 bg-[#FDE047] border-2 border-[#09090B] rounded-xl mx-auto mb-4 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
            <Star size={28} weight="bold" />
          </div>
          <p className="font-['Outfit'] font-bold text-lg text-[#09090B]">Your resume will appear here</p>
          <p className="text-sm text-[#52525B] mt-1">Answer the questions to build it live</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-paper border border-gray-200 rounded-sm overflow-hidden" data-testid="resume-preview" style={{ fontSize: "11px", lineHeight: "1.5" }}>
      {/* Header */}
      <div className={`${t.headerBg} ${t.headerText} px-6 py-4`}>
        <h1 className="font-bold text-xl tracking-tight">{pi.name || "Your Name"}</h1>
        {resume.job_role && <p className="text-sm opacity-80 mt-0.5">{resume.job_role}{resume.company ? ` at ${resume.company}` : ""}</p>}
        <div className="flex flex-wrap gap-3 mt-2 text-[10px] opacity-80">
          {pi.email && <span className="flex items-center gap-1"><Envelope size={10} />{pi.email}</span>}
          {pi.phone && <span className="flex items-center gap-1"><Phone size={10} />{pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1"><MapPin size={10} />{pi.location}</span>}
        </div>
      </div>

      <div className="px-6 py-4 space-y-3">
        {/* Summary */}
        {resume.summary && (
          <div>
            <SectionTitle icon={Star} title="Professional Summary" template={template} />
            <p className="text-[10px] text-[#333]">{resume.summary}</p>
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div>
            <SectionTitle icon={GraduationCap} title="Education" template={template} />
            {Array.isArray(resume.education) ? resume.education.map((edu, i) => (
              <div key={i} className="mb-1">
                {typeof edu === "object" ? (
                  <>
                    <div className="flex justify-between">
                      <span className="font-bold text-[10px]">{edu.degree}</span>
                      {edu.year && <span className="text-[9px] text-[#666]">{edu.year}</span>}
                    </div>
                    <div className="text-[9px] text-[#666]">{edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</div>
                  </>
                ) : <p className="text-[10px]">{String(edu)}</p>}
              </div>
            )) : <p className="text-[10px]">{String(resume.education)}</p>}
          </div>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div>
            <SectionTitle icon={Lightbulb} title="Skills" template={template} />
            <div className="flex flex-wrap gap-1">
              {Array.isArray(resume.skills) ? resume.skills.map((skill, i) => (
                <span key={i} className={`text-[9px] px-2 py-0.5 rounded-full border ${template === "modern" ? "bg-[#F5F3FF] border-[#C4B5FD] text-[#1a1a2e]" : "bg-[#F4F4F5] border-[#E4E4E7] text-[#09090B]"}`}>
                  {String(skill)}
                </span>
              )) : <p className="text-[10px]">{String(resume.skills)}</p>}
            </div>
          </div>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div>
            <SectionTitle icon={Briefcase} title="Experience" template={template} />
            {Array.isArray(resume.experience) ? resume.experience.map((exp, i) => (
              <div key={i} className="mb-2">
                {typeof exp === "object" ? (
                  <>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-[10px]">{exp.title}{exp.company ? ` at ${exp.company}` : ""}</span>
                      {exp.duration && <span className="text-[9px] text-[#666] flex-shrink-0 ml-2">{exp.duration}</span>}
                    </div>
                    {exp.description && <p className="text-[9px] text-[#555] mt-0.5">{exp.description}</p>}
                  </>
                ) : <p className="text-[10px]">{String(exp)}</p>}
              </div>
            )) : <p className="text-[10px]">{String(resume.experience)}</p>}
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div>
            <SectionTitle icon={Lightbulb} title="Projects" template={template} />
            {Array.isArray(resume.projects) ? resume.projects.map((proj, i) => (
              <div key={i} className="mb-2">
                {typeof proj === "object" ? (
                  <>
                    <span className="font-bold text-[10px]">{proj.name}{proj.tech ? ` (${proj.tech})` : ""}</span>
                    {proj.description && <p className="text-[9px] text-[#555] mt-0.5">{proj.description}</p>}
                  </>
                ) : <p className="text-[10px]">{String(proj)}</p>}
              </div>
            )) : <p className="text-[10px]">{String(resume.projects)}</p>}
          </div>
        )}

        {/* Achievements */}
        {resume.achievements && resume.achievements.length > 0 && (
          <div>
            <SectionTitle icon={Trophy} title="Achievements" template={template} />
            {Array.isArray(resume.achievements) ? resume.achievements.map((ach, i) => (
              <p key={i} className="text-[10px]">- {String(ach)}</p>
            )) : <p className="text-[10px]">{String(resume.achievements)}</p>}
          </div>
        )}

        {/* Hobbies */}
        {resume.hobbies && resume.hobbies.length > 0 && (
          <div>
            <SectionTitle icon={GameController} title="Interests" template={template} />
            <p className="text-[10px]">{Array.isArray(resume.hobbies) ? resume.hobbies.join(" | ") : String(resume.hobbies)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
