// Projetos do portfólio. Fatos tirados dos READMEs, do histórico de commits e do código.
// Por decisão do Yan, sites feitos para clientes ficam fora; só entram as duas lojas modelo.

const midia = (slug) => ({
  video: `/midia/${slug}/video.mp4`,
  videoMovel: `/midia/${slug}/video-m.mp4`,
  poster: `/midia/${slug}/poster.webp`,
})

export const projetosIntro = {
  titulo: 'Projetos selecionados',
  apoio: 'Duas lojas conceito em 3D, um projeto em equipe na faculdade e dois projetos de sistemas em C.',
}

export const projetos = [
  {
    slug: 'sola',
    largo: true,
    meta: ['Loja conceito', '2026'],
    selo: 'No ar',
    nome: 'SOLA.',
    frase: 'Vitrine de tênis em 3D para a loja de um amigo: a câmera voa até o modelo escolhido e abre o produto.',
    feitos: [
      'Cena em three.js com prateleiras de acrílico, LED, reflexo e sombras desenhadas',
      'Tênis fotorrealistas recortados por um script em Python (rembg e pymatting)',
      'Sacola, rota por produto e pedido finalizado no WhatsApp',
    ],
    stack: ['React', 'three.js', 'GSAP', 'Python'],
    links: { site: 'https://yan791.github.io/modelo_loja_tenis/', codigo: 'https://github.com/yan791/modelo_loja_tenis' },
    endereco: 'yan791.github.io/modelo_loja_tenis',
    midia: midia('sola'),
    alt: 'Gravação da vitrine SOLA.: o LED acende nas prateleiras e a câmera se aproxima do tênis Mata 02, que abre o painel do produto.',
    nota: 'Marca fictícia, criada para a demonstração.',
  },
  {
    slug: 'arquivo',
    meta: ['Loja conceito', '2026'],
    selo: 'No ar',
    nome: 'arquivo®',
    frase: 'Loja em uma sala 3D, com camisas que viram na arara quando o cursor passa.',
    feitos: [
      'Giro com uma malha 3D gerada a partir das fotos de frente e de lado',
      'Script em Python que recorta as peças e remove o cabide',
      'Testes que percorrem a loja e medem o tempo de cada quadro',
    ],
    stack: ['React', 'three.js', 'Lenis', 'Python'],
    links: { site: 'https://yan791.github.io/loja-modelo-arquivo/', codigo: 'https://github.com/yan791/loja-modelo-arquivo' },
    endereco: 'yan791.github.io/loja-modelo-arquivo',
    midia: midia('arquivo'),
    alt: 'Gravação da loja arquivo®: camisas numa arara cromada viram de lado para frente e o painel da camisa Jogo 2K abre com tamanhos e medidas.',
    nota: 'Marca fictícia, criada para a demonstração.',
  },
  {
    slug: 'intellifit',
    meta: ['CESAR School', 'Equipe de 7', '2025'],
    selo: 'Back-end',
    nome: 'IntelliFit',
    frase: 'Aplicação web em Django para montar treinos, registrar o progresso e organizar a rotina.',
    feitos: [
      'Criei o módulo de anotações: modelo, migração, rotas e telas de listar, criar, editar e excluir',
      'Implementei a edição e a exclusão de registros de progresso e do perfil',
      'Documentei as entregas da equipe no README, sprint a sprint',
    ],
    stack: ['Django', 'Python', 'SQLite', 'GitHub Actions', 'AWS EC2'],
    links: { codigo: 'https://github.com/eduardohasantos/intellifit' },
    endereco: 'localhost:8000/notes',
    imagem: { src: '/midia/intellifit/anotacoes.webp', alt: 'Tela Minhas Anotações do IntelliFit, com três anotações e os botões Editar e Excluir.', largura: 952, altura: 574 },
    nota: 'O deploy na AWS não está mais no ar; a tela foi capturada rodando o projeto localmente.',
  },
  {
    slug: 'processflow',
    meta: ['CESAR School', 'Individual', '2026'],
    selo: 'Sistemas',
    nome: 'ProcessFlow',
    frase: 'Orquestrador de processos em C: tarefas em sequência, em paralelo ou ligadas por pipes, com jobs em segundo plano.',
    feitos: [
      'Cada tarefa roda num processo filho com fork e execvp, sem system() nem popen()',
      'Pipes entre várias tarefas com pipe e dup2, e redirecionamento de entrada e saída',
      'Jobs em segundo plano recolhidos pelo tratador de SIGCHLD',
    ],
    stack: ['C', 'POSIX', 'Linux', 'Make'],
    links: { codigo: 'https://github.com/yan791/processFlow' },
    terminal: true,
  },
  {
    slug: 'escalonador',
    meta: ['CESAR School', 'Individual', '2026'],
    selo: 'Sistemas',
    nome: 'Escalonador RM × EDF',
    frase: 'Simulador preemptivo de tarefas periódicas de voo, comparando Rate-Monotonic e Earliest Deadline First.',
    feitos: [
      'Simulação unidade a unidade com preempção, prazos perdidos e histórico de CPU',
      'Validação estrita da entrada (C ≤ D ≤ P) e compilação sem avisos com -Wall -Wextra',
      'A demonstração ao lado segue as mesmas regras e é testada contra a saída do programa em C',
    ],
    stack: ['C11', 'Make', 'Linux'],
    links: { codigo: 'https://github.com/yan791/Escalonamento_de_tarefas_criticas_de_voo' },
    gantt: true,
  },
]

// "Mais coisas que fiz": o resto, organizado. Sem sites de clientes.
export const maisCoisas = [
  { nome: 'RecifeSafe', texto: 'Painel com dados públicos da Guarda Municipal do Recife · Flask, Pandas, Leaflet e Plotly', ano: '2026', link: 'https://github.com/yan791/Dashboard-de-Dados-Publicos' },
  { nome: 'Mandelbrot paralelo', texto: 'A mesma imagem em serial, Pthreads e OpenMP, com o tempo de cada versão', ano: '2026', link: 'https://github.com/yan791/Conjunto_de_Mandelbrot' },
  { nome: 'Algoritmo do Banqueiro', texto: 'Clientes e recursos dinâmicos, validação completa da entrada e testes por módulo · C99', ano: '2026', link: 'https://github.com/yan791/banker' },
  { nome: 'Sincronização com mutex', texto: 'Passageiros e carro coordenados com um mutex e duas variáveis de condição · Pthreads', ano: '2026', link: 'https://github.com/yan791/sincronizacao_metro' },
  { nome: 'PintOS Alarm Clock', texto: 'timer_sleep() no kernel do PintOS sem espera ocupada · em dupla', ano: '2026', link: 'https://github.com/yan791/Alarm_Clock' },
  { nome: 'Frevo Runner', texto: 'Jogo em C com Raylib inspirado no Carnaval de Olinda · fiz o ciclo de desenho, os sprites e o áudio', ano: '2026', link: 'https://github.com/yan791/Frevo_Runner', selo: 'Equipe de 3' },
  { nome: 'Análise do Brasileirão', texto: 'Dashboard com estatísticas de 2003 a 2024 · Streamlit, Pandas e Plotly', ano: '2026', link: 'https://github.com/yan791/Analise_Brasileirao', selo: 'Dupla' },
  { nome: 'Locadora e imobiliária', texto: 'Back-ends em Java com MVC e DAO sobre JDBC e MySQL', ano: '2026', link: 'https://github.com/caioleimig/Autocar_BD', selo: 'Equipe' },
  { nome: 'KeyFlow', texto: 'SaaS de cofre de senhas para pequenas empresas · atuei na proposta de valor e na divisão de tarefas', ano: '2026', selo: 'Equipe de 12' },
  { nome: 'Cosmic Blaster', texto: 'Jogo de naves em C com Raylib, listas encadeadas e alocação dinâmica', ano: '2025', link: 'https://github.com/yan791/Cosmic_Blaster', selo: 'Equipe de 3' },
  { nome: 'Calculadora didática', texto: 'Conversão de decimal para binário e outras bases em Assembly MIPS', ano: '2025', link: 'https://github.com/yan791/Calculadora_Didatica' },
  { nome: 'NutriChoice', texto: 'Planos alimentares personalizados em Django, com testes end-to-end em Cypress', ano: '2025', link: 'https://github.com/gabrielfranca10/projeto-nutri-choice', selo: 'Equipe de 6' },
  { nome: 'Monitoramento da Poluição Sonora', texto: 'Protótipo com Arduino e espelhos infinitos que acendem conforme o ruído', ano: '2024', selo: 'Destaque', destaque: true },
]
