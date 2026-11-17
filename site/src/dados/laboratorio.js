// Material real dos repositórios. As saídas abaixo foram geradas executando os programas em C.

export const lab = {
  rotulo: 'Laboratório',
  titulo: 'Laboratório',
  apoio: 'Os projetos de sistemas são de terminal. Aqui dá para ver a lógica deles funcionando.',
}

export const exemplosEscalonador = [
  {
    id: 'readme',
    nome: 'Exemplo do README',
    tempoTotal: 20,
    tarefas: [
      { nome: 'NAV', periodo: 5, deadline: 5, burst: 2 },
      { nome: 'COM', periodo: 10, deadline: 8, burst: 3 },
    ],
  },
  {
    id: 'rm-perde',
    nome: 'Rate-Monotonic perde um prazo',
    tempoTotal: 35,
    tarefas: [
      { nome: 'A', periodo: 5, deadline: 5, burst: 2 },
      { nome: 'B', periodo: 7, deadline: 7, burst: 4 },
    ],
  },
  {
    id: 'quatro',
    nome: 'Quatro tarefas de voo',
    tempoTotal: 40,
    tarefas: [
      { nome: 'GPS', periodo: 8, deadline: 6, burst: 2 },
      { nome: 'RADIO', periodo: 10, deadline: 10, burst: 3 },
      { nome: 'MOTOR', periodo: 20, deadline: 15, burst: 6 },
      { nome: 'CABINE', periodo: 40, deadline: 40, burst: 4 },
    ],
  },
]

export const banqueiro = {
  nome: 'Algoritmo do Banqueiro',
  repo: 'https://github.com/yan791/banker',
  comando: './banker 10 5 7',
  // trecho real de result.txt
  saida: `Allocate to customer 1 the resources 1 0 2
The resources 2 3 0 are not enough to customer 4 request 3 3 0
The customer 0 request 0 2 0 was denied because result in an unsafe state
MAXIMUM   |   ALLOCATION  |   NEED
7 5 3     |   0 1 0       |   7 4 3
3 2 2     |   3 0 2       |   0 2 0
9 0 2     |   3 0 2       |   6 0 0
2 2 2     |   2 1 1       |   0 1 1
4 3 3     |   0 0 2       |   4 3 1
AVAILABLE 2 3 0`,
  texto: 'Número dinâmico de clientes e tipos de recurso. Antes de executar qualquer comando, valida os argumentos e os dois arquivos inteiros e aponta arquivo, linha e problema.',
}

export const sincronizacao = {
  nome: 'Sincronização: estação e carro',
  repo: 'https://github.com/yan791/sincronizacao_metro',
  codigo: `struct station {
    pthread_mutex_t mutex;
    pthread_cond_t car_available;
    pthread_cond_t all_boarded;

    int passengers_released;
    int passengers_boarded;
    int waiting_passengers;
    int car_present;
    int seats_available;
};`,
  texto: 'Passageiros e carro coordenados com um mutex e duas variáveis de condição, com testes.',
}

export const mandelbrot = {
  nome: 'Mandelbrot paralelo',
  repo: 'https://github.com/yan791/Conjunto_de_Mandelbrot',
  texto: 'A mesma imagem calculada de quatro jeitos, com o tempo de cada um medido por clock_gettime e as imagens salvas em PGM.',
  estrategias: [
    { id: 'serial', nome: 'Serial', detalhe: 'linha por linha, uma thread' },
    { id: 'blocos', nome: 'Pthreads · blocos', detalhe: 'cada thread recebe um bloco fixo de linhas' },
    { id: 'fila', nome: 'Pthreads · fila', detalhe: 'cada thread pega a próxima linha livre, protegida por mutex' },
    { id: 'openmp', nome: 'OpenMP', detalhe: 'parallel for com schedule(dynamic, 1)' },
  ],
}

export const pintos = {
  nome: 'PintOS · Alarm Clock',
  repo: 'https://github.com/yan791/Alarm_Clock',
  texto: 'timer_sleep() reimplementado no kernel do PintOS sem espera ocupada. Em dupla.',
}

export const processflow = {
  nome: 'ProcessFlow',
  repo: 'https://github.com/yan791/processFlow',
  // arquivo .pf do README
  roteiro: ['task listar /bin/ls -l', 'task ordenar /usr/bin/sort', 'task contar /usr/bin/wc -l', 'run pipe listar ordenar contar', 'task sono /bin/sleep 2', 'start sono', 'jobs', 'wait 1', 'exit'],
}
