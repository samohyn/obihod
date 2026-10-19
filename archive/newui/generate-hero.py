"""Генерирует hero-фото арбориста для правой колонки homepage-classic.html"""
import fal_client, os, json, pathlib, requests

os.environ["FAL_KEY"] = os.environ.get("FAL_KEY", "")
if not os.environ["FAL_KEY"]:
    print("ERROR: FAL_KEY"); exit(1)

OUT = pathlib.Path(__file__).parent / "img-generated"
OUT.mkdir(exist_ok=True)

# Генерируем 3 варианта — оператор выберет
VARIANTS = [
    {
        "id": "hero-arborist-v1",
        "prompt": (
            "Professional arborist in dark green uniform and orange helmet "
            "cutting large birch tree branches with chainsaw from yellow aerial work platform, "
            "Russian suburban garden, summer day, golden hour light filtering through leaves, "
            "vertical composition, dramatic atmospheric lighting, photorealistic documentary, "
            "shallow depth of field, no text"
        ),
        "size": "portrait_16_9",
    },
    {
        "id": "hero-arborist-v2",
        "prompt": (
            "Side view of arborist alpinist climbing tall pine tree with safety ropes and harness, "
            "chainsaw in hand, Moscow Oblast forest backdrop, late afternoon golden light, "
            "dynamic action pose, vertical composition, photorealistic, cinematic, no text"
        ),
        "size": "portrait_16_9",
    },
    {
        "id": "hero-arborist-v3",
        "prompt": (
            "Close-up portrait shot of professional arborist team member in dark green Obikhod uniform, "
            "orange helmet, holding chainsaw, suburban Moscow garden behind with autovышка lift, "
            "confident matter-of-fact expression, vertical composition, natural light, "
            "photorealistic, no text, shallow background blur"
        ),
        "size": "portrait_16_9",
    },
]

results = []
for v in VARIANTS:
    print(f"  {v['id']}...")
    try:
        r = fal_client.run(
            "fal-ai/flux/schnell",
            arguments={
                "prompt": v["prompt"],
                "image_size": v["size"],
                "num_inference_steps": 4,
                "num_images": 1,
            },
        )
        url = r["images"][0]["url"]
        dest = OUT / f"{v['id']}.jpg"
        resp = requests.get(url, timeout=60); resp.raise_for_status()
        dest.write_bytes(resp.content)
        print(f"  ✓ {dest.name}")
        results.append({"id": v["id"], "file": str(dest), "url": url})
    except Exception as e:
        print(f"  ✗ {e}")

# Add to manifest
mp = OUT / "manifest.json"
existing = json.loads(mp.read_text()) if mp.exists() else []
by_id = {r["id"]: r for r in existing}
for r in results: by_id[r["id"]] = r
mp.write_text(json.dumps(list(by_id.values()), indent=2, ensure_ascii=False))
print(f"\nГотово: {len(results)}/3")
