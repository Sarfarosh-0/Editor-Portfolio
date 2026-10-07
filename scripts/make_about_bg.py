import math
from PIL import Image, ImageDraw

width = 800
height = 450
frames = []
num_frames = 24

for i in range(num_frames):
    im = Image.new("RGB", (width, height), (5, 8, 12))
    draw = ImageDraw.Draw(im)
    
    phase = (i / num_frames) * 2 * math.pi
    cx1 = int(width * 0.35 + math.sin(phase) * 60)
    cy1 = int(height * 0.45 + math.cos(phase) * 40)
    r1 = 280
    
    cx2 = int(width * 0.7 + math.cos(phase) * 50)
    cy2 = int(height * 0.55 + math.sin(phase) * 35)
    r2 = 240

    # Draw ambient dark radial glowing circles
    for r in range(r1, 0, -10):
        alpha = int((1 - r / r1) * 30)
        draw.ellipse([cx1 - r, cy1 - r, cx1 + r, cy1 + r], fill=(int(alpha * 0.26), int(alpha * 0.86), int(alpha * 1.0)))

    for r in range(r2, 0, -10):
        alpha = int((1 - r / r2) * 22)
        draw.ellipse([cx2 - r, cy2 - r, cx2 + r, cy2 + r], fill=(int(alpha * 0.47), int(alpha * 1.0), int(alpha * 0.84)))

    frames.append(im.convert("P", palette=Image.ADAPTIVE))

frames[0].save(
    "public/placeholders/about-bg.gif",
    save_all=True,
    append_images=frames[1:],
    duration=100,
    loop=0,
    optimize=True
)
print("Successfully generated public/placeholders/about-bg.gif")
