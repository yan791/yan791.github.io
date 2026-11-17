# Folha de quadros de um vídeo bruto para revisar a gravação.
# Uso: python ferramentas/folha.py <pasta-do-projeto> [n]
import subprocess, sys, os, json
from PIL import Image

pasta = sys.argv[1]
n = int(sys.argv[2]) if len(sys.argv) > 2 else 8
video = os.path.join(pasta, 'bruto.webm')
dur = float(subprocess.run(['ffmpeg', '-v', 'error', '-i', video, '-f', 'null', '-', '-progress', '-'], capture_output=True, text=True).stdout.split('out_time_ms=')[-1].split('\n')[0]) / 1e6
quadros = []
for i in range(n):
    t = dur * (i + 0.5) / n
    saida = os.path.join(pasta, f'_q{i}.jpg')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', video, '-frames:v', '1', '-vf', 'scale=400:-1', saida], check=True)
    quadros.append((t, Image.open(saida).copy()))
    os.remove(saida)
w, h = quadros[0][1].size
col = 4
folha = Image.new('RGB', (w * col, h * ((n + col - 1) // col)))
for i, (t, im) in enumerate(quadros):
    folha.paste(im, ((i % col) * w, (i // col) * h))
folha.save(os.path.join(pasta, 'folha.jpg'), quality=78)
print(pasta, f'{dur:.1f}s', [round(t, 1) for t, _ in quadros])
