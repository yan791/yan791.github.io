# Prepara as imagens do site em public/midia (fotos do Yan, Mostra e telas dos projetos).
# Uso: python ferramentas/imagens.py [retrato] [mostra] [telas]   (sem argumentos: tudo)
import os
from PIL import Image, ImageOps

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, '..', '..'))
PUBLICO = os.path.join(RAIZ, 'site', 'public', 'midia')
NOVAS = os.path.join(RAIZ, 'Novas Imagens')


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


# 3. telas dos projetos rodando localmente (capturas de fotos-nutrichoice.mjs e fotos-livros.mjs), em 16:10
TELAS = {
    # destino: (captura, recorte x0, y0, x1, y1 ou None para a tela inteira)
    ('nutrichoice', 'cardapio.webp'): ('nutrichoice/03-cardapio.png', (150, 0, 1200, 656)),
    ('livros', 'painel.webp'): ('livros/01-inicio.png', None),
    ('recifesafe', 'painel.webp'): ('recifesafe/01-topo.png', None),
}


def telas():
    for (pasta, nome), (origem, caixa) in TELAS.items():
        im = Image.open(os.path.join(RAIZ, 'imagens', 'projetos', origem)).convert('RGB')
        if caixa:
            im = im.crop(caixa)
        if im.size[0] > 1280:
            im = im.resize((1280, round(im.size[1] * 1280 / im.size[0])), Image.LANCZOS)
        salvar(im, pasta, nome, q=84)


if __name__ == '__main__':
    import sys
    passos = {'retrato': retrato, 'mostra': mostra, 'telas': telas}
    for nome in sys.argv[1:] or passos:
        passos[nome]()
