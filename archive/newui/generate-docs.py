"""
Генерирует превью-изображения документов для §08 trust-секции
FAL_KEY=<ключ> python3 generate-docs.py
"""
import fal_client, os, json, pathlib, requests

KEY = os.environ.get("FAL_KEY", "")
if not KEY:
    print("ERROR: укажи FAL_KEY=...")
    exit(1)
os.environ["FAL_KEY"] = KEY

OUT = pathlib.Path(__file__).parent / "img-generated"
OUT.mkdir(exist_ok=True)

MODEL = "fal-ai/flux/schnell"

DOCS = [
    {
        "id": "doc-sro",
        "prompt": (
            "Russian official SRO membership certificate document, portrait orientation, "
            "cream white paper, dark green header with gold emblem, blue official round stamp seal, "
            "handwritten signature, serial number, minimalist professional government document design, "
            "photorealistic scan, slight paper texture, no people"
        ),
    },
    {
        "id": "doc-insurance",
        "prompt": (
            "Russian Ingosstrakh insurance policy document cover page, portrait orientation, "
            "white cream paper, dark blue and gold Ingosstrakh logo at top, "
            "policy number, 5 million rubles liability coverage text, "
            "official blue round stamp, professional clean document design, photorealistic"
        ),
    },
    {
        "id": "doc-cert-arborist",
        "prompt": (
            "Russian professional qualification certificate for arborist rope access specialist, "
            "portrait orientation, cream paper, official header with Russian eagle emblem, "
            "3rd category certification mark, gold seal, signature fields, "
            "clean professional government-issued certificate design, photorealistic scan"
        ),
    },
    {
        "id": "doc-egryl",
        "prompt": (
            "Russian EGRUL business registry extract document (Выписка из ЕГРЮЛ), "
            "portrait orientation, white paper, Federal Tax Service FNS Russia header, "
            "official Russian government document format, blue stamp, QR code in corner, "
            "clean official typography, photorealistic document scan"
        ),
    },
    {
        "id": "doc-equipment",
        "prompt": (
            "Russian vehicle technical inspection passport document for aerial work platform truck, "
            "portrait orientation, cream paper, official Russian transport ministry header, "
            "blue official stamp, registration number, valid until date, "
            "professional technical document design, photorealistic"
        ),
    },
    {
        "id": "doc-152fz",
        "prompt": (
            "Russian Roskomnadzor personal data operator registration certificate, "
            "portrait orientation, white paper, Roskomnadzor official logo header, "
            "152-FZ compliance certificate, registry number, official blue round stamp, "
            "clean government document design, photorealistic scan"
        ),
    },
    {
        "id": "doc-waste",
        "prompt": (
            "Russian waste disposal and recycling license agreement document cover, "
            "portrait orientation, cream paper, licensed landfill operator certificate, "
            "89-FZ waste law compliance, green environmental stamp, "
            "official Russian document design, photorealistic scan"
        ),
    },
    {
        "id": "doc-eis",
        "prompt": (
            "Russian government procurement EIS portal accreditation certificate, "
            "portrait orientation, white paper, Russian Federation official coat of arms, "
            "44-FZ / 223-FZ public procurement accreditation, official blue stamp, "
            "government document design, photorealistic scan"
        ),
    },
]

results = []
for doc in DOCS:
    print(f"  Генерирую: {doc['id']}...")
    try:
        result = fal_client.run(
            MODEL,
            arguments={
                "prompt": doc["prompt"],
                "image_size": "portrait_4_3",
                "num_inference_steps": 4,
                "num_images": 1,
            },
        )
        url = result["images"][0]["url"]
        dest = OUT / f"{doc['id']}.jpg"
        resp = requests.get(url, timeout=60)
        resp.raise_for_status()
        dest.write_bytes(resp.content)
        print(f"  Сохранено: {dest.name}")
        results.append({"id": doc["id"], "file": str(dest), "url": url})
    except Exception as e:
        print(f"  ОШИБКА {doc['id']}: {e}")

# Добавляем в manifest
manifest_path = OUT / "manifest.json"
existing = json.loads(manifest_path.read_text()) if manifest_path.exists() else []
by_id = {r["id"]: r for r in existing}
for r in results:
    by_id[r["id"]] = r
manifest_path.write_text(json.dumps(list(by_id.values()), indent=2, ensure_ascii=False))
print(f"\nГотово. {len(results)} документов в {OUT}")
