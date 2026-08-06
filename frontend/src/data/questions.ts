export interface QuestionOption {
  letter: string;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
}

const questions: Question[] = [
  {
    id: 1,
    question:
      "Quando você olha para a sua lista de tarefas do dia, qual é o seu primeiro sentimento?",
    options: [
      {
        letter: "A",
        text: "Ansiedade. Ver muita coisa me trauma, preciso riscar algo rápido para respirar.",
      },
      {
        letter: "B",
        text: 'Determinação ou preguiça. Sei que tem um "leão" ali que preciso matar logo, ou vou passar o dia empurrando com a barriga.',
      },
      {
        letter: "C",
        text: "Impaciência. Quero começar logo, mas sei que me perco no meio do caminho se não me organizar em blocos.",
      },
      {
        letter: "D",
        text: "Sobrecarga. Muitas vezes não sei o que é prioridade e acabo pulando de galho em galho.",
      },
      {
        letter: "E",
        text: "Desânimo profundo. Minha vontade é fechar o notebook e fingir que nada disso existe.",
      },
    ],
  },
  {
    id: 2,
    question:
      'Como funciona a sua "bateria" de energia mental ao longo do dia?',
    options: [
      {
        letter: "A",
        text: "Eu funciono bem em picos. Consigo produzir muito em 20 minutos, mas logo preciso de uma pausa.",
      },
      {
        letter: "B",
        text: "Sou uma máquina de aquecimento. Demoro para engrenar, mas quando entro no fluxo, vou direto.",
      },
      {
        letter: "C",
        text: "Minha energia flutua muito. Se eu não quebrar o tempo de forma rígida, eu me distraio.",
      },
      {
        letter: "D",
        text: "Minha energia é mais alta logo no início da manhã e despenca conforme o tempo passa.",
      },
      {
        letter: "E",
        text: 'Minha bateria está sempre no modo "economia de energia". Só ligo no modo turbo se o prazo for para ontem.',
      },
    ],
  },
  {
    id: 3,
    question: "O que costuma arruinar o seu foco com mais frequência?",
    options: [
      { letter: "A", text: "O cansaço físico ou mental que surge de repente." },
      {
        letter: "B",
        text: "Interrupções externas (mensagens, reuniões, pessoas chamando).",
      },
      {
        letter: "C",
        text: 'Minha própria mente criando microtarefas ("deixa eu só ver esse e-mail", "pegar água").',
      },
      {
        letter: "D",
        text: "A sensação de que a tarefa é grande demais e eu nunca vou terminar.",
      },
      {
        letter: "E",
        text: "Qualquer conforto ou distração barata (uma deitada na cama, reels no Instagram, o teto da sala).",
      },
    ],
  },
  {
    id: 4,
    question: "Pensando em um videogame: como você prefere progredir?",
    options: [
      {
        letter: "A",
        text: "Matando os monstros pequenos e fáceis primeiro para subir de nível rápido.",
      },
      {
        letter: "B",
        text: 'Indo direto para o "chefe final" da fase para livrar o caminho.',
      },
      {
        letter: "C",
        text: "Jogando com um cronômetro na tela que me obriga a correr e pausar nos momentos certos.",
      },
      {
        letter: "D",
        text: "Dividindo a missão principal em 5 sub-missões bem pequenas e focando em uma por vez.",
      },
      {
        letter: "E",
        text: "Deixando o boneco parado no mapa (AFK) ou procurando um cheat/atalho para pular a fase chata.",
      },
    ],
  },
  {
    id: 5,
    question: "Qual é o seu cenário ideal de conclusão de dia de trabalho?",
    options: [
      {
        letter: "A",
        text: "Ter riscado o maior número possível de itens da lista.",
      },
      {
        letter: "B",
        text: "Ter resolvido o problem mais complexo, mesmo que outros menores tenham ficado para amanhã.",
      },
      {
        letter: "C",
        text: "Ter mantido uma rotina constante e equilibrada, sem terminar o dia exausto.",
      },
      {
        letter: "D",
        text: "Ter clareza exata de onde parei para saber exatamente por onde continuar amanhã.",
      },
      {
        letter: "E",
        text: "Ter feito o mínimo necessário para ninguém me cobrar, gastando o menor esforço possível.",
      },
    ],
  },
];

export default questions;
