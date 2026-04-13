import { useState } from "react";
import { User, Article, GraduationCap, Lightbulb, Briefcase, Rocket, Trophy, GameController, FloppyDisk, PencilSimple, Plus, Trash, CaretDown, CaretUp } from "@phosphor-icons/react";

const SECTIONS = [
  { key: "personal_info", label: "Personal Info", icon: User },
  { key: "summary", label: "Summary", icon: Article },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "skills", label: "Skills", icon: Lightbulb },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "projects", label: "Projects", icon: Rocket },
  { key: "achievements", label: "Achievements", icon: Trophy },
  { key: "hobbies", label: "Hobbies & Interests", icon: GameController },
];

function PersonalInfoEditor({ data, onChange }) {
  const pi = data || {};
  const set = (k, v) => onChange({ ...pi, [k]: v });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[["name", "Full Name"], ["email", "Email"], ["phone", "Phone"], ["location", "Location"]].map(([k, l]) => (
        <div key={k}>
          <label className="text-xs font-bold text-[#52525B] mb-1 block">{l}</label>
          <input value={pi[k] || ""} onChange={e => set(k, e.target.value)} className="w-full bg-[#FAFAFA] border-2 border-[#E4E4E7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4B5FD]" data-testid={`edit-${k}`} />
        </div>
      ))}
    </div>
  );
}

function TextEditor({ value, onChange, placeholder, rows = 3 }) {
  return <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="w-full bg-[#FAFAFA] border-2 border-[#E4E4E7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4B5FD] resize-none" />;
}

function ArrayItemEditor({ items, onChange, fields, addLabel }) {
  const parsed = Array.isArray(items) ? items : [];
  const addItem = () => {
    const blank = {};
    fields.forEach(f => { blank[f.key] = ""; });
    onChange([...parsed, blank]);
  };
  const removeItem = (idx) => onChange(parsed.filter((_, i) => i !== idx));
  const updateItem = (idx, key, val) => {
    const updated = [...parsed];
    if (typeof updated[idx] === "object") { updated[idx] = { ...updated[idx], [key]: val }; }
    else { updated[idx] = { [key]: val }; }
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {parsed.map((item, idx) => (
        <div key={idx} className="bg-[#FAFAFA] border-2 border-[#E4E4E7] rounded-lg p-3 relative">
          <button onClick={() => removeItem(idx)} className="absolute top-2 right-2 p-1 hover:bg-[#FDA4AF]/30 rounded-lg" data-testid={`remove-item-${idx}`}>
            <Trash size={14} weight="bold" className="text-[#FDA4AF]" />
          </button>
          <div className="grid grid-cols-1 gap-2 pr-8">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-xs font-bold text-[#52525B] mb-0.5 block">{f.label}</label>
                {f.multiline ? (
                  <textarea value={typeof item === "object" ? (item[f.key] || "") : String(item)} onChange={e => updateItem(idx, f.key, e.target.value)} rows={2} className="w-full bg-white border border-[#E4E4E7] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#C4B5FD] resize-none" />
                ) : (
                  <input value={typeof item === "object" ? (item[f.key] || "") : String(item)} onChange={e => updateItem(idx, f.key, e.target.value)} className="w-full bg-white border border-[#E4E4E7] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#C4B5FD]" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addItem} className="neo-btn flex items-center gap-1 px-3 py-2 bg-[#FFFFFF] border-2 border-[#09090B] rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]" data-testid={`add-${addLabel}`}>
        <Plus size={12} weight="bold" /> Add {addLabel}
      </button>
    </div>
  );
}

function TagsEditor({ items, onChange, placeholder }) {
  const parsed = Array.isArray(items) ? items : [];
  const [input, setInput] = useState("");
  const addTag = () => {
    if (!input.trim()) return;
    onChange([...parsed, input.trim()]);
    setInput("");
  };
  const removeTag = (idx) => onChange(parsed.filter((_, i) => i !== idx));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {parsed.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[#FAFAFA] border-2 border-[#E4E4E7] rounded-full font-medium">
            {String(tag)}
            <button onClick={() => removeTag(i)} className="hover:text-red-500" data-testid={`remove-tag-${i}`}>&times;</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder={placeholder} className="flex-1 bg-[#FAFAFA] border-2 border-[#E4E4E7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4B5FD]" />
        <button onClick={addTag} className="neo-btn px-3 py-2 bg-[#FDE047] border-2 border-[#09090B] rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">Add</button>
      </div>
    </div>
  );
}

export default function SectionEditor({ resume, onSave, saving }) {
  const [editData, setEditData] = useState({ ...resume });
  const [openSection, setOpenSection] = useState("personal_info");
  const [dirty, setDirty] = useState(false);

  const updateField = (key, value) => {
    setEditData(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    onSave(editData);
    setDirty(false);
  };

  const toggleSection = (key) => setOpenSection(openSection === key ? null : key);

  return (
    <div className="flex flex-col h-full" data-testid="section-editor">
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-[#09090B] bg-[#FFFFFF] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PencilSimple size={18} weight="bold" className="text-[#C4B5FD]" />
          <span className="text-sm font-bold text-[#09090B]">Edit Resume</span>
        </div>
        {dirty && (
          <button onClick={handleSave} disabled={saving} className="neo-btn flex items-center gap-1 px-4 py-1.5 bg-[#FDE047] border-2 border-[#09090B] rounded-full text-xs font-bold shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] disabled:opacity-50" data-testid="save-edits-btn">
            <FloppyDisk size={14} weight="bold" /> {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2" data-testid="edit-sections-list">
        {SECTIONS.map(({ key, label, icon: Icon }) => (
          <div key={key} className={`bg-[#FFFFFF] border-2 ${openSection === key ? "border-[#09090B] shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]" : "border-[#E4E4E7]"} rounded-xl overflow-hidden transition-all`}>
            <button onClick={() => toggleSection(key)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#FAFAFA] transition-all" data-testid={`toggle-section-${key}`}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${openSection === key ? "bg-[#FDE047]" : "bg-[#F4F4F5]"}`}>
                  <Icon size={14} weight="bold" />
                </div>
                <span className="text-sm font-bold text-[#09090B]">{label}</span>
              </div>
              {openSection === key ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
            </button>

            {openSection === key && (
              <div className="px-4 pb-4 animate-fade-in">
                {key === "personal_info" && (
                  <PersonalInfoEditor data={editData.personal_info} onChange={v => updateField("personal_info", v)} />
                )}
                {key === "summary" && (
                  <TextEditor value={editData.summary} onChange={v => updateField("summary", v)} placeholder="Professional summary..." rows={4} />
                )}
                {key === "education" && (
                  <ArrayItemEditor items={editData.education} onChange={v => updateField("education", v)} addLabel="Education"
                    fields={[{ key: "degree", label: "Degree" }, { key: "institution", label: "Institution" }, { key: "year", label: "Year" }, { key: "gpa", label: "GPA" }]} />
                )}
                {key === "skills" && (
                  <TagsEditor items={editData.skills} onChange={v => updateField("skills", v)} placeholder="Add a skill..." />
                )}
                {key === "experience" && (
                  <ArrayItemEditor items={editData.experience} onChange={v => updateField("experience", v)} addLabel="Experience"
                    fields={[{ key: "title", label: "Job Title" }, { key: "company", label: "Company" }, { key: "duration", label: "Duration" }, { key: "description", label: "Description", multiline: true }]} />
                )}
                {key === "projects" && (
                  <ArrayItemEditor items={editData.projects} onChange={v => updateField("projects", v)} addLabel="Project"
                    fields={[{ key: "name", label: "Project Name" }, { key: "tech", label: "Technologies" }, { key: "description", label: "Description", multiline: true }]} />
                )}
                {key === "achievements" && (
                  <TagsEditor items={editData.achievements} onChange={v => updateField("achievements", v)} placeholder="Add an achievement..." />
                )}
                {key === "hobbies" && (
                  <TagsEditor items={editData.hobbies} onChange={v => updateField("hobbies", v)} placeholder="Add a hobby..." />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom save bar */}
      {dirty && (
        <div className="px-4 py-3 border-t-2 border-[#09090B] bg-[#FFFFFF]">
          <button onClick={handleSave} disabled={saving} className="neo-btn w-full px-4 py-3 bg-[#FDE047] border-2 border-[#09090B] rounded-full text-sm font-bold shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] flex items-center justify-center gap-2 disabled:opacity-50" data-testid="save-all-btn">
            <FloppyDisk size={16} weight="bold" /> {saving ? "Saving changes..." : "Save All Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
