import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER


def generate_resume_pdf(resume: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch, bottomMargin=0.5*inch, leftMargin=0.6*inch, rightMargin=0.6*inch)

    styles = getSampleStyleSheet()
    primary_color = HexColor("#1a1a2e")
    accent_color = HexColor("#16213e")

    name_style = ParagraphStyle("Name", parent=styles["Title"], fontSize=22, textColor=primary_color, spaceAfter=4, alignment=TA_CENTER, fontName="Helvetica-Bold")
    contact_style = ParagraphStyle("Contact", parent=styles["Normal"], fontSize=9, textColor=HexColor("#555555"), alignment=TA_CENTER, spaceAfter=12)
    section_title = ParagraphStyle("SectionTitle", parent=styles["Heading2"], fontSize=12, textColor=primary_color, fontName="Helvetica-Bold", spaceBefore=14, spaceAfter=6, borderWidth=0)
    body_style = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=14, textColor=HexColor("#333333"), fontName="Helvetica")
    bold_body = ParagraphStyle("BoldBody", parent=body_style, fontName="Helvetica-Bold")
    small_style = ParagraphStyle("Small", parent=body_style, fontSize=9, textColor=HexColor("#666666"))

    elements = []
    pi = resume.get("personal_info", {})
    name = pi.get("name", "Your Name")
    elements.append(Paragraph(name, name_style))

    contact_parts = []
    if pi.get("email"): contact_parts.append(pi["email"])
    if pi.get("phone"): contact_parts.append(pi["phone"])
    if pi.get("location"): contact_parts.append(pi["location"])
    if contact_parts:
        elements.append(Paragraph(" | ".join(contact_parts), contact_style))

    elements.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=8))

    summary = resume.get("summary", "")
    if summary:
        elements.append(Paragraph("PROFESSIONAL SUMMARY", section_title))
        elements.append(Paragraph(summary, body_style))

    education = resume.get("education", [])
    if education:
        elements.append(Paragraph("EDUCATION", section_title))
        if isinstance(education, list):
            for edu in education:
                if isinstance(edu, dict):
                    line = f"<b>{edu.get('degree', '')}</b> - {edu.get('institution', '')}"
                    if edu.get("year"): line += f" ({edu['year']})"
                    if edu.get("gpa"): line += f" | GPA: {edu['gpa']}"
                    elements.append(Paragraph(line, body_style))
                else:
                    elements.append(Paragraph(str(edu), body_style))
        else:
            elements.append(Paragraph(str(education), body_style))

    skills = resume.get("skills", [])
    if skills:
        elements.append(Paragraph("SKILLS", section_title))
        if isinstance(skills, list):
            elements.append(Paragraph(" | ".join(str(s) for s in skills), body_style))
        else:
            elements.append(Paragraph(str(skills), body_style))

    experience = resume.get("experience", [])
    if experience:
        elements.append(Paragraph("WORK EXPERIENCE", section_title))
        if isinstance(experience, list):
            for exp in experience:
                if isinstance(exp, dict):
                    header = f"<b>{exp.get('title', '')}</b> at {exp.get('company', '')}"
                    if exp.get("duration"): header += f" | {exp['duration']}"
                    elements.append(Paragraph(header, body_style))
                    if exp.get("description"):
                        elements.append(Paragraph(exp["description"], small_style))
                    elements.append(Spacer(1, 4))
                else:
                    elements.append(Paragraph(str(exp), body_style))
        else:
            elements.append(Paragraph(str(experience), body_style))

    projects = resume.get("projects", [])
    if projects:
        elements.append(Paragraph("PROJECTS", section_title))
        if isinstance(projects, list):
            for proj in projects:
                if isinstance(proj, dict):
                    line = f"<b>{proj.get('name', '')}</b>"
                    if proj.get("tech"): line += f" ({proj['tech']})"
                    elements.append(Paragraph(line, body_style))
                    if proj.get("description"):
                        elements.append(Paragraph(proj["description"], small_style))
                    elements.append(Spacer(1, 4))
                else:
                    elements.append(Paragraph(str(proj), body_style))
        else:
            elements.append(Paragraph(str(projects), body_style))

    achievements = resume.get("achievements", [])
    if achievements:
        elements.append(Paragraph("ACHIEVEMENTS", section_title))
        if isinstance(achievements, list):
            for ach in achievements:
                elements.append(Paragraph(f"- {str(ach)}", body_style))
        else:
            elements.append(Paragraph(str(achievements), body_style))

    hobbies = resume.get("hobbies", [])
    if hobbies:
        elements.append(Paragraph("INTERESTS", section_title))
        if isinstance(hobbies, list):
            elements.append(Paragraph(" | ".join(str(h) for h in hobbies), body_style))
        else:
            elements.append(Paragraph(str(hobbies), body_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer


def generate_cover_letter_pdf(cover_letter: str, personal_info: dict, job_role: str, company: str) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.8*inch, bottomMargin=0.8*inch, leftMargin=0.8*inch, rightMargin=0.8*inch)

    styles = getSampleStyleSheet()
    primary_color = HexColor("#1a1a2e")

    name_style = ParagraphStyle("CLName", parent=styles["Title"], fontSize=18, textColor=primary_color, spaceAfter=4, alignment=TA_LEFT, fontName="Helvetica-Bold")
    contact_style = ParagraphStyle("CLContact", parent=styles["Normal"], fontSize=9, textColor=HexColor("#555555"), alignment=TA_LEFT, spaceAfter=16)
    body_style = ParagraphStyle("CLBody", parent=styles["Normal"], fontSize=11, leading=18, textColor=HexColor("#333333"), fontName="Helvetica", spaceAfter=12)

    elements = []

    name = personal_info.get("name", "")
    if name:
        elements.append(Paragraph(name, name_style))
    contact_parts = []
    if personal_info.get("email"): contact_parts.append(personal_info["email"])
    if personal_info.get("phone"): contact_parts.append(personal_info["phone"])
    if personal_info.get("location"): contact_parts.append(personal_info["location"])
    if contact_parts:
        elements.append(Paragraph(" | ".join(contact_parts), contact_style))

    elements.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=16))

    for paragraph in cover_letter.split("\n"):
        stripped = paragraph.strip()
        if stripped:
            elements.append(Paragraph(stripped, body_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer
