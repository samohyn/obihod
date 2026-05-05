"""
[art] fal.ai image generation для homepage-classic.html
Запуск: FAL_KEY=<ключ> python3 generate-photos.py

Генерирует 9 изображений:
  - 6 кейсов (до/после в виде split-image)
  - 2 для §05 фото→смета (output card + hero bg элемент)
  - 1 hero background texture
"""
import fal_client, os, json, pathlib
import requests

KEY = os.environ.get("FAL_KEY", "")
if not KEY:
    print("ERROR: укажи FAL_KEY=... перед запуском")
    exit(1)

os.environ["FAL_KEY"] = KEY

OUT = pathlib.Path(__file__).parent / "img-generated"
OUT.mkdir(exist_ok=True)

MODEL = "fal-ai/flux/schnell"  # быстрый и качественный

PROMPTS = [
    # Cases — 6 изображений
    {
        "id": "case-01-birch",
        "prompt": (
            "Professional arborist team in dark green uniforms cutting down a large emergency birch tree "
            "18 meters tall leaning dangerously near a Russian dacha house, Moscow suburbs winter, "
            "chainsaw work from aerial lift platform, photorealistic, safety ropes visible, "
            "overcast sky, snow on ground, documentary photography style"
        ),
        "size": "landscape_4_3",
    },
    {
        "id": "case-02-banya-before",
        "prompt": (
            "Old dilapidated Russian wooden bathhouse (banya) 4x5 meters in suburban Moscow garden, "
            "weathered grey wood, overgrown with weeds, ready for demolition, "
            "daytime, overcast, photorealistic documentary photo"
        ),
        "size": "landscape_4_3",
    },
    {
        "id": "case-03-roof-snow",
        "prompt": (
            "Workers clearing heavy snow from rooftop of Russian apartment complex, Moscow suburbs winter, "
            "safety harnesses, industrial rope access, aerial view, white snow piles on dark roof, "
            "professional service team in high-vis uniforms, photorealistic"
        ),
        "size": "landscape_4_3",
    },
    {
        "id": "case-04-clearing",
        "prompt": (
            "Storm damage cleanup in Russian suburban garden, fallen trees and broken branches scattered, "
            "professional crew with chainsaw and wood chipper machine, large waste container nearby, "
            "clearing a private plot after storm, photorealistic documentary"
        ),
        "size": "landscape_4_3",
    },
    {
        "id": "case-05-b2b-complex",
        "prompt": (
            "Aerial view of Russian residential complex (многоквартирный дом) in Khimki suburb, "
            "professional landscaping and snow removal team working on grounds, "
            "winter, organized equipment trucks parked, clean professional service, photorealistic"
        ),
        "size": "landscape_4_3",
    },
    {
        "id": "case-06-pruning",
        "prompt": (
            "Professional arborist on aerial lift platform carefully pruning old apple and pear trees "
            "in Russian dacha garden near Moscow, Pushkino suburb, spring, "
            "neat crown shaping work, blue sky, photorealistic"
        ),
        "size": "landscape_4_3",
    },
    # §05 фото→смета — input photo в output card
    {
        "id": "smeta-birch-emergency",
        "prompt": (
            "Emergency birch tree 18 meters tall dangerously leaning at 25 degree angle near Russian country house, "
            "dark storm clouds, dramatic angle, phone camera snapshot style, "
            "Moscow Oblast suburb SNT, photorealistic"
        ),
        "size": "square",
    },
    # Hero background element — scenic professional work
    {
        "id": "hero-arborist-work",
        "prompt": (
            "Wide angle panoramic view of professional arborist team working in lush green forest near Moscow suburbs, "
            "aerial lift platform beside tall pine and birch trees, green uniforms, golden hour light, "
            "Russian countryside, wide landscape, cinematic, photorealistic, no text"
        ),
        "size": "landscape_16_9",
    },
    # Team trust photo
    {
        "id": "team-brigade",
        "prompt": (
            "Professional Russian landscaping and arborist brigade team of 4 people in matching dark green uniforms "
            "standing in front of their service truck, suburban Moscow, autumn, "
            "confident professional look, company photo style, photorealistic, no text"
        ),
        "size": "landscape_4_3",
    },
]


def generate(item):
    print(f"  Генерирую: {item['id']}...")
    result = fal_client.run(
        MODEL,
        arguments={
            "prompt": item["prompt"],
            "image_size": item["size"],
            "num_inference_steps": 4,
            "num_images": 1,
        },
    )
    url = result["images"][0]["url"]
    ext = "jpg"
    dest = OUT / f"{item['id']}.{ext}"
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    dest.write_bytes(resp.content)
    print(f"  Сохранено: {dest.name} ← {url[:60]}...")
    return {"id": item["id"], "file": str(dest), "url": url}


if __name__ == "__main__":
    results = []
    for p in PROMPTS:
        try:
            r = generate(p)
            results.append(r)
        except Exception as e:
            print(f"  ОШИБКА {p['id']}: {e}")

    manifest = OUT / "manifest.json"
    manifest.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"\nГотово. {len(results)} файлов в {OUT}")
    print("Следующий шаг: python3 apply-photos.py — вставит URL в homepage-classic.html")
