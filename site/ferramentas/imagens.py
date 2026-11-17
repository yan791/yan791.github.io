# Prepara as imagens do site em public/midia (fotos do Yan, Mostra e telas do IntelliFit).
# Uso: python -I ferramentas/imagens.py
import os
from PIL import Image, ImageOps

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, '..', '..'))
PUBLICO = os.path.join(RAIZ, 'site', 'public', 'midia')
NOVAS = os.path.join(RAIZ, 'Novas Imagens')
IF_BRUTO = os.path.join(RAIZ, 'imagens', 'projetos', 'intellifit')


def salvar(im, *caminho, q=82):
    destino = os.path.join(PUBLICO, *caminho)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    im.save(destino, 'WEBP', quality=q, method=6)
    print(os.path.relpath(destino, PUBLICO), im.size, os.path.getsize(destino) // 1024, 'KB')


# 1. retrato sem fundo (rembg) em PNG com alfa -> webp com alfa
def retrato():
    from rembg import remove, new_session
    im = ImageOps.exif_transpose(Image.open(os.path.join(NOVAS, 'yan.png'))).convert('RGB')
    sessao = new_session('isnet-general-use')
    recorte = remove(im, session=sessao, post_process_mask=True)
    salvar(recorte, 'yan', 'retrato.webp', q=90)
    salvar(im, 'yan', 'retrato-fundo.webp', q=88)


# 2. Mostra TechDesign
def mostra():
    salvar(Image.open(os.path.join(NOVAS, 'projetos01.png')).convert('RGB'), 'mostra', 'equipe.webp')
    salvar(Image.open(os.path.join(NOVAS, 'certificado_destaque_mostratech.jpeg')).convert('RGB'), 'mostra', 'certificado.webp', q=88)


# 3. telas do IntelliFit, recortadas no cartão de conteúdo (abaixo da barra azul)
def intellifit():
    for nome in ['01-dashboard', '02-anotacoes', '03-nova-anotacao', '04-progresso', '05-treinos', '06-anotacao']:
        im = Image.open(os.path.join(IF_BRUTO, f'{nome}.png')).convert('RGB')
        w, h = im.size
        barra = 76
        fundo = im.getpixel((8, barra + 12))
        conteudo = im.crop((0, barra, w, h))
        # caixa dos pixels diferentes do fundo
        px = conteudo.load()
        xs, ys = [], []
        for y in range(0, conteudo.size[1], 2):
            for x in range(0, w, 2):
                r, g, b = px[x, y]
                if abs(r - fundo[0]) + abs(g - fundo[1]) + abs(b - fundo[2]) > 18:
                    xs.append(x)
                    ys.append(y)
        x0, x1, y0, y1 = max(min(xs) - 28, 0), min(max(xs) + 28, w), max(min(ys) - 28, 0), min(max(ys) + 28, conteudo.size[1])
        cartao = conteudo.crop((x0, y0, x1, y1))
        # a barra do app volta por cima, na largura do recorte, para a tela ser reconhecível
        topo = im.crop((0, 0, w, barra)).resize((cartao.size[0], round(barra * cartao.size[0] / w)))
        final = Image.new('RGB', (cartao.size[0], cartao.size[1] + topo.size[1]), fundo)
        final.paste(topo, (0, 0))
        final.paste(cartao, (0, topo.size[1]))
        salvar(final, 'intellifit', f'{nome[3:]}.webp')


retrato()
mostra()
intellifit()
