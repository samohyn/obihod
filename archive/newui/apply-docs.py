"""Применяет doc-изображения к §08 trust-карточкам"""
import pathlib

HTML = pathlib.Path(__file__).parent / "homepage-classic.html"

# Порядок совпадает с порядком .doc в HTML (8 карточек)
DOCS = [
    "doc-sro",
    "doc-insurance",
    "doc-cert-arborist",
    "doc-egryl",
    "doc-equipment",
    "doc-152fz",
    "doc-waste",
    "doc-eis",
]

text = HTML.read_text(encoding="utf-8")
lines = text.splitlines(keepends=True)

doc_idx = 0
out = []
for line in lines:
    if 'class="doc"' in line and doc_idx < len(DOCS):
        img = f"img-generated/{DOCS[doc_idx]}.jpg"
        line = line.replace(
            '<div class="doc">',
            f'<div class="doc" style="background-image:url(\'{img}\');background-size:cover;background-position:center top;min-height:120px;position:relative;">'
        )
        doc_idx += 1
    out.append(line)

HTML.write_text("".join(out), encoding="utf-8")
print(f"✓ Применено {doc_idx} doc-изображений")
