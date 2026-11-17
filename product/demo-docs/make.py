"""Builds the two synthetic invoices used in the demo. No real clinic or patient.

    python3 make.py

clean-invoice.pdf   exported once by a (made-up) clinic system
forged-invoice.pdf  same invoice, amount raised, re-saved in an image editor
"""


def pdf(lines, info):
    text = "BT /F1 14 Tf 60 780 Td 20 TL " + " ".join(f"({l}) Tj T*" for l in lines) + " ET"
    objs = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R "
        "/Resources << /Font << /F1 5 0 R >> >> >>",
        f"<< /Length {len(text)} >>\nstream\n{text}\nendstream",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        "<< " + " ".join(f"/{k} ({v})" for k, v in info.items()) + " >>",
    ]
    out, offsets = "%PDF-1.4\n", []
    for i, body in enumerate(objs, 1):
        offsets.append(len(out))
        out += f"{i} 0 obj\n{body}\nendobj\n"
    xref = len(out)
    out += f"xref\n0 {len(objs) + 1}\n0000000000 65535 f \n"
    out += "".join(f"{o:010d} 00000 n \n" for o in offsets)
    out += f"trailer\n<< /Size {len(objs) + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n{xref}\n%%EOF\n"
    return out


def resave(doc, info):
    """Append an incremental update, the way an editor saves on top of a file."""
    prev = int(doc.rsplit("startxref\n", 1)[1].split("\n")[0])
    start = len(doc)
    body = "6 0 obj\n<< " + " ".join(f"/{k} ({v})" for k, v in info.items()) + " >>\nendobj\n"
    xref = start + len(body)
    return (
        doc + body + f"xref\n6 1\n{start:010d} 00000 n \n"
        f"trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R /Prev {prev} >>\nstartxref\n{xref}\n%%EOF\n"
    )


HEAD = ["Demo Merkezi Klinika", "Hesab-faktura No 2026/0412", "", "Xeste: Eli M.",
        "Diaqnoz: Anadangelme urek qusuru", "Xidmet: Aciq urek emeliyyati"]
CLINIC = {"Producer": "DemoClinic HIS 4.2", "Creator": "DemoClinic HIS",
          "CreationDate": "D:20261102101500+04'00'", "ModDate": "D:20261102101500+04'00'"}

open("clean-invoice.pdf", "w", encoding="latin-1").write(
    pdf(HEAD + ["Mebleg: 25 000 AZN"], CLINIC))

open("forged-invoice.pdf", "w", encoding="latin-1").write(
    resave(pdf(HEAD + ["Mebleg: 60 000 AZN"], CLINIC),
           {**CLINIC, "Producer": "Adobe Photoshop 25.4", "ModDate": "D:20261115231200+04'00'"}))
