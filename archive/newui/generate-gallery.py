"""Генерирует фото с объектов для горизонтальной галереи §09.5"""
import fal_client, os, json, pathlib, requests

KEY = os.environ.get("FAL_KEY", "")
if not KEY:
    print("ERROR: FAL_KEY не задан"); exit(1)
os.environ["FAL_KEY"] = KEY

OUT = pathlib.Path(__file__).parent / "img-generated"
OUT.mkdir(exist_ok=True)

MODEL = "fal-ai/flux/schnell"

GALLERY = [
    {
        "id": "gal-01-spil-alpinist",
        "prompt": (
            "Professional arborist in safety harness and helmet climbing high birch tree 20 meters, "
            "rope access technique, chainsaw work, Moscow suburb garden, sunny day, "
            "green leaves, documentary photo style, photorealistic, wide angle"
        ),
    },
    {
        "id": "gal-02-avtowyshka",
        "prompt": (
            "Yellow aerial work platform truck (автовышка) extended 18 meters beside large pine tree, "
            "two workers in orange helmets trimming branches, Russian suburban street, "
            "autumn day, photorealistic documentary"
        ),
    },
    {
        "id": "gal-03-pyen-frezer",
        "prompt": (
            "Industrial stump grinding machine (фреза) removing large oak tree stump in Russian garden, "
            "wood chips flying, worker in protective gear operating machine, "
            "dacha plot, summer green grass, photorealistic"
        ),
    },
    {
        "id": "gal-04-roof-winter",
        "prompt": (
            "Workers in safety harnesses removing heavy snow from steep roof of Russian country house, "
            "winter scene, snowfall, shoveling snow off red tiled roof, "
            "icicles being knocked down, safety ropes visible, photorealistic"
        ),
    },
    {
        "id": "gal-05-container-musor",
        "prompt": (
            "Large orange waste container 8 cubic meters being loaded with construction debris "
            "at Moscow suburb renovation site, excavator arm, professional waste removal team, "
            "sunny day, photorealistic documentary"
        ),
    },
    {
        "id": "gal-06-demolition-saray",
        "prompt": (
            "Professional demolition of old wooden barn (сарай) at Russian dacha, "
            "workers dismantling grey weathered wood structure, excavator nearby, "
            "clear blue sky, debris being sorted for removal, photorealistic"
        ),
    },
    {
        "id": "gal-07-kronirovanie-sad",
        "prompt": (
            "Arborist on aerial lift carefully pruning and shaping old apple orchard trees, "
            "Russian garden spring bloom, precise crown reduction work, "
            "neat professional result, photorealistic wide shot"
        ),
    },
    {
        "id": "gal-08-brigada-work",
        "prompt": (
            "Professional landscaping crew of 4 workers in matching dark green uniforms "
            "loading wood chips into truck after tree removal, Moscow suburb, "
            "clean efficient teamwork, equipment visible, photorealistic"
        ),
    },
]

results = []
for item in GALLERY:
    print(f"  {item['id']}...")
    try:
        r = fal_client.run(
            MODEL,
            arguments={
                "prompt": item["prompt"],
                "image_size": "landscape_4_3",
                "num_inference_steps": 4,
                "num_images": 1,
            },
        )
        url = r["images"][0]["url"]
        dest = OUT / f"{item['id']}.jpg"
        resp = requests.get(url, timeout=60)
        resp.raise_for_status()
        dest.write_bytes(resp.content)
        print(f"  ✓ {dest.name}")
        results.append({"id": item["id"], "file": str(dest), "url": url})
    except Exception as e:
        print(f"  ✗ {e}")

manifest_path = OUT / "manifest.json"
existing = json.loads(manifest_path.read_text()) if manifest_path.exists() else []
by_id = {r["id"]: r for r in existing}
for r in results:
    by_id[r["id"]] = r
manifest_path.write_text(json.dumps(list(by_id.values()), indent=2, ensure_ascii=False))
print(f"\nГотово: {len(results)}/8 фото")
