// Projetos do portfólio. Fatos tirados dos READMEs, do histórico de commits e do código.
// Por decisão do Yan, sites feitos para clientes ficam fora.

export const projetosIntro = {
  titulo: 'Projetos selecionados',
  apoio: 'Uma seleção de projetos que desenvolvi e que representam um pouco do meu trabalho.',
}

// Abre a seção, grande.
export const destaque = {
  slug: 'sola',
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
  midia: {
    video: '/midia/sola/video.mp4',
    videoMovel: '/midia/sola/video-m.mp4',
    poster: '/midia/sola/poster.webp',
  },
  alt: 'Gravação da vitrine SOLA.: o LED acende nas prateleiras e a câmera se aproxima do tênis Mata 02, que abre o painel do produto.',
  nota: 'Marca fictícia, criada para a demonstração.',
}

// Vitrine compacta: uma lista à esquerda e a prévia do projeto aberto à direita.
export const projetos = [
  {
    slug: 'livros',
    tipo: 'Dados · Streamlit',
    meta: ['Projeto pessoal', 'Individual', '2025'],
    ano: '2025',
    nome: 'Análise dos 100 livros mais vendidos',
    frase: 'Painel em Streamlit com os 100 livros em alta na Amazon e uma página com as avaliações dos leitores de cada um.',
    feitos: [
      'Filtro de preço na barra lateral que atualiza a tabela e o histograma',
      'Gráficos em Plotly com os livros por ano de publicação e a distribuição dos preços',
    ],
    stack: ['Python', 'Streamlit', 'Pandas', 'Plotly'],
    links: { codigo: 'https://github.com/yan791/analise_100livros_amazon' },
    endereco: 'localhost:8501',
    imagem: { src: '/midia/livros/painel.webp', alt: 'Painel da análise dos livros: filtro de preço na barra lateral, tabela com ranking, título, preço, nota e autor, e dois gráficos de barras.', largura: 1280, altura: 800 },
    nota: 'Capturado rodando o projeto localmente.',
  },
  {
    slug: 'escalonador',
    tipo: 'Sistemas · C',
    meta: ['CESAR School', 'Individual', '2026'],
    ano: '2026',
    nome: 'Escalonador RM × EDF',
    frase: 'Simulador preemptivo de tarefas periódicas de voo, comparando Rate-Monotonic e Earliest Deadline First.',
    feitos: [
      'Simulação unidade a unidade com preempção, prazos perdidos e histórico de CPU',
      'A demonstração ao lado segue as mesmas regras e é testada contra a saída do programa em C',
    ],
    stack: ['C11', 'Make', 'Linux'],
    links: { codigo: 'https://github.com/yan791/Escalonamento_de_tarefas_criticas_de_voo' },
    gantt: true,
  },
  {
    slug: 'processflow',
    tipo: 'Sistemas · C',
    meta: ['CESAR School', 'Individual', '2026'],
    ano: '2026',
    nome: 'ProcessFlow',
    frase: 'Orquestrador de processos em C: tarefas em sequência, em paralelo ou ligadas por pipes, com jobs em segundo plano.',
    feitos: [
      'Cada tarefa roda num processo filho com fork e execvp, sem system() nem popen()',
      'Pipes entre várias tarefas com pipe e dup2, e jobs recolhidos pelo tratador de SIGCHLD',
    ],
    stack: ['C', 'POSIX', 'Linux', 'Make'],
    links: { codigo: 'https://github.com/yan791/processFlow' },
    terminal: true,
  },
  {
    slug: 'recifesafe',
    tipo: 'Dados · Flask',
    meta: ['Projeto pessoal', 'Individual', '2026'],
    ano: '2026',
    nome: 'RecifeSafe',
    frase: 'Painel de dados públicos com as operações da Guarda Municipal do Recife em 2023: indicadores, mapa por bairro e volume por mês.',
    feitos: [
      'Script em Pandas que extrai bairro, mês, turno e categoria do texto de cada uma das 174 operações',
      'API REST em Flask-RESTful com filtros por categoria, mês e bairro',
    ],
    stack: ['Python', 'Flask', 'Pandas', 'Leaflet', 'Plotly'],
    links: { codigo: 'https://github.com/yan791/Dashboard-de-Dados-Publicos' },
    endereco: 'localhost:5000',
    imagem: { src: '/midia/recifesafe/painel.webp', alt: 'Dashboard de Segurança do RecifeSafe: 174 operações, filtros por categoria e mês, mapa de ocorrências no Recife e gráfico de volume mensal.', largura: 1280, altura: 800 },
    nota: 'Capturado rodando o projeto localmente.',
  },
  {
    slug: 'nutrichoice',
    tipo: 'Web · Django',
    meta: ['CESAR School', 'Equipe de 6', '2025'],
    ano: '2025',
    nome: 'NutriChoice',
    frase: 'Plataforma que transforma as respostas de um questionário em um cardápio personalizado, com receitas, dicas e controle de água, calorias e peso.',
    feitos: [
      'Implementei o registro de peso: modelo, migração, formulário e view',
      'Montei o workflow do GitHub Actions que publica na Azure e roda os testes end-to-end em Cypress',
    ],
    stack: ['Django', 'Python', 'Cypress', 'GitHub Actions', 'Azure'],
    links: { codigo: 'https://github.com/gabrielfranca10/projeto-nutri-choice' },
    endereco: 'localhost:8000/cardapio',
    imagem: { src: '/midia/nutrichoice/cardapio.webp', alt: 'Tela Seu Cardápio Personalizado do NutriChoice, com café da manhã, almoço, lanche e jantar montados a partir do questionário.', largura: 1050, altura: 656 },
    nota: 'O deploy na Azure saiu do ar; a tela foi capturada rodando o projeto localmente.',
  },
]

// "Mais projetos que fiz": o resto, organizado. Sem sites de clientes.
export const maisCoisas = [
  { nome: 'arquivo®', texto: 'Loja conceito em uma sala 3D, com camisas que viram na arara · React e three.js', ano: '2026', link: 'https://yan791.github.io/loja-modelo-arquivo/' },
  { nome: 'Mandelbrot paralelo', texto: 'A mesma imagem em serial, Pthreads e OpenMP, com o tempo de cada versão', ano: '2026', link: 'https://github.com/yan791/Conjunto_de_Mandelbrot' },
  { nome: 'Algoritmo do Banqueiro', texto: 'Clientes e recursos dinâmicos, validação completa da entrada e testes por módulo · C99', ano: '2026', link: 'https://github.com/yan791/banker' },
  { nome: 'Sincronização com mutex', texto: 'Passageiros e carro coordenados com um mutex e duas variáveis de condição · Pthreads', ano: '2026', link: 'https://github.com/yan791/sincronizacao_metro' },
  { nome: 'PintOS Alarm Clock', texto: 'timer_sleep() no kernel do PintOS sem espera ocupada · em dupla', ano: '2026', link: 'https://github.com/yan791/Alarm_Clock' },
  { nome: 'Frevo Runner', texto: 'Jogo em C com Raylib inspirado no Carnaval de Olinda · fiz o ciclo de desenho, os sprites e o áudio', ano: '2026', link: 'https://github.com/yan791/Frevo_Runner', selo: 'Equipe de 3' },
  { nome: 'Análise do Brasileirão', texto: 'Dashboard com estatísticas de 2003 a 2024 · Streamlit, Pandas e Plotly', ano: '2026', link: 'https://github.com/yan791/Analise_Brasileirao', selo: 'Dupla' },
  { nome: 'Locadora e imobiliária', texto: 'Back-ends em Java com MVC e DAO sobre JDBC e MySQL', ano: '2026', link: 'https://github.com/caioleimig/Autocar_BD', selo: 'Equipe' },
  { nome: 'KeyFlow', texto: 'SaaS de cofre de senhas para pequenas empresas · atuei na proposta de valor e na divisão de tarefas', ano: '2026', selo: 'Equipe de 12' },
  { nome: 'IntelliFit', texto: 'Treinos e progresso em Django · criei o módulo de anotações e documentei as sprints', ano: '2025', link: 'https://github.com/eduardohasantos/intellifit', selo: 'Equipe de 7' },
  { nome: 'Cosmic Blaster', texto: 'Jogo de naves em C com Raylib, listas encadeadas e alocação dinâmica', ano: '2025', link: 'https://github.com/yan791/Cosmic_Blaster', selo: 'Equipe de 3' },
  { nome: 'Calculadora didática', texto: 'Conversão de decimal para binário e outras bases em Assembly MIPS', ano: '2025', link: 'https://github.com/yan791/Calculadora_Didatica' },
  { nome: 'Monitoramento da Poluição Sonora', texto: 'Protótipo com Arduino e espelhos infinitos que acendem conforme o ruído', ano: '2024', selo: 'Destaque', destaque: true },
]
