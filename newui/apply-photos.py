"""
Применяет сгенерированные фото к homepage-classic.html
Запуск: python3 apply-photos.py
"""
import pathlib, json

OUT   = pathlib.Path(__file__).parent / "img-generated"
HTML  = pathlib.Path(__file__).parent / "homepage-classic.html"

manifest = json.loads((OUT / "manifest.json").read_text())
by_id   = {r["id"]: pathlib.Path(r["file"]).name for r in manifest}

# Маппинг: подстрока в lbl → id файла
CASE_MAP = [
    ("аварийная берёза",      "case-01-birch"),
    ("старая баня",           "case-02-banya-before"),
    ("крыша 850",             "case-03-roof-snow"),
    ("контейнер 30",          "case-04-clearing"),
    ("12 объектов",           "case-05-b2b-complex"),
    ("кронирование 4",        "case-06-pruning"),
]

lines = HTML.read_text(encoding="utf-8").splitlines(keepends=True)
out   = []
i     = 0

while i < len(lines):
    line = lines[i]

    # --- кейс-карточки: ищем <div class="photo"> и смотрим lbl в следующих 5 строках ---
    if '<div class="photo">' in line and 'aspect-ratio' not in line:
        matched_id = None
        for j in range(i, min(i + 6, len(lines))):
            for lbl_text, img_id in CASE_MAP:
                if lbl_text in lines[j]:
                    matched_id = img_id
                    break
            if matched_id:
                break

        if matched_id and matched_id in by_id:
            img_path = f"img-generated/{by_id[matched_id]}"
            line = line.replace(
                '<div class="photo">',
                f'<div class="photo" style="background-image:url(\'{img_path}\');background-size:cover;background-position:center top;">'
            )

    # --- §05 output card: фото объекта (aspect-ratio: 1/1) ---
    if 'aspect-ratio: 1/1' in line and '<div class="photo"' in line:
        smeta_img = by_id.get("smeta-birch-emergency", "")
        if smeta_img:
            line = line.replace(
                'style="aspect-ratio: 1/1;"',
                f'style="aspect-ratio:1/1;background-image:url(\'img-generated/{smeta_img}\');background-size:cover;background-position:center top;"'
            )

    out.append(line)
    i += 1

HTML.write_text("".join(out), encoding="utf-8")
print(f"✓ homepage-classic.html обновлён — {len(CASE_MAP)} кейсов + smeta card")
