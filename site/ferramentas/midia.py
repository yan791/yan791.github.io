# Converte as gravações brutas (../imagens/projetos/<slug>/bruto.webm) em mídia web:
# video.mp4 (1280x800), video-m.mp4 (720x450) e poster.webp, em public/midia/<slug>/.
# Uso: python ferramentas/midia.py [slug ...]
import os, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
BRUTO = os.path.normpath(os.path.join(AQUI, '..', '..', 'imagens', 'projetos'))
PUBLICO = os.path.normpath(os.path.join(AQUI, '..', 'public', 'midia'))

# slug: (início, fim, instante do pôster)
CORTES = {
    'sola': (0.3, 10.3, 9.6),
    'arquivo': (0.4, 15.8, 4.6),
    'livi': (0.4, 15.0, 1.0),
    'dr-notebook': (0.2, 10.0, 9.4),
    'jv': (0.2, 6.6, 3.2),
    'volts': (4.0, 15.4, 0.5),
    'ioma': (0.0, 7.6, 6.8),
    'cm3': (0.0, 11.9, 0.6),
}


def rodar(*args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *args], check=True)


def converter(slug):
    ini, fim, poster = CORTES[slug]
    src = os.path.join(BRUTO, slug, 'bruto.webm')
    dst = os.path.join(PUBLICO, slug)
    os.makedirs(dst, exist_ok=True)
    comum = ['-ss', f'{ini}', '-to', f'{fim}', '-i', src, '-an', '-r', '30', '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-movflags', '+faststart', '-g', '60']
    rodar(*comum, '-vf', 'scale=1280:800:flags=lanczos', '-crf', '27', os.path.join(dst, 'video.mp4'))
    rodar(*comum, '-vf', 'scale=720:450:flags=lanczos', '-crf', '28', os.path.join(dst, 'video-m.mp4'))
    rodar('-ss', f'{poster}', '-i', src, '-frames:v', '1', '-vf', 'scale=1280:800:flags=lanczos', '-c:v', 'libwebp', '-quality', '80', os.path.join(dst, 'poster.webp'))
    tam = {f: os.path.getsize(os.path.join(dst, f)) // 1024 for f in os.listdir(dst)}
    print(slug, tam)


for slug in (sys.argv[1:] or CORTES):
    converter(slug)
