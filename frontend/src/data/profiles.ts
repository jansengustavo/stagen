export type ProfileId =
  | "quick-wins"
  | "eat-the-frog"
  | "pomodoro"
  | "desconstrutor"
  | "inercia";

export interface ProfileEntry {
  id: ProfileId;
  title: string;
  subtitle: string;
  diagnosis: string;
  action: string;
  focus: string;
  color: string;
}

const profiles: Record<string, ProfileEntry> = {
  A: {
    id: "quick-wins",
    title: "O Estrategista de Vitórias Rápidas",
    subtitle: "Quick Wins",
    diagnosis:
      "A ansiedade ou o volume de tarefas te travam. Você precisa de dopamina rápida para engrenar.",
    action:
      "Comece pelas tarefas mais fáceis e rápidas (que levam menos de 15 minutos). Riscar 2 ou 3 itens logo no início da manhã vai dar ao seu cérebro a sensação de progresso necessária para encarar os desafios maiores depois.",
    focus: "Tiros curtos de 20 a 30 minutos, com 5 minutos de pausa.",
    color: "var(--red-01)",
  },
  B: {
    id: "eat-the-frog",
    title: "O Caçador de Mamutes",
    subtitle: "Eat the Frog",
    diagnosis:
      "Você sofre com a procrastinação de tarefas complexas. Se deixar o pior para o final, você não vai fazer.",
    action:
      "Use a técnica Eat the Frog. Dedique a primeira hora do seu dia — onde sua energia mental está no topo — exclusivamente para a task mais complexa ou chata. O resto do dia parecerá incrivelmente leve.",
    focus:
      "Blocos longos de hiperfoco (60 a 90 minutos), pois você demora um pouco para entrar no estado de fluxo, mas rende muito quando chega lá.",
    color: "var(--green-01, #22c55e)",
  },
  C: {
    id: "pomodoro",
    title: "O Maratonista do Pomodoro",
    subtitle: "Pomodoro",
    diagnosis:
      "Sua mente é hiperativa e se distrai com facilidade se o tempo parecer infinito.",
    action:
      "Seu melhor amigo é o Pomodoro clássico. Você precisa de estrutura rígida para negociar com o seu cérebro. 25 minutos de foco absoluto (sem olhar o celular) e 5 minutos de pausa obrigatória (levante, estique as pernas). A cada 4 ciclos, faça uma pausa maior de 20 minutos.",
    focus:
      "25 minutos de foco + 5 de pausa. A cada 4 ciclos, pausa longa de 20 minutos.",
    color: "var(--blue-01)",
  },
  D: {
    id: "desconstrutor",
    title: "O Desconstrutor de Tasks",
    subtitle: "Desconstrutor",
    diagnosis:
      "Grandes projetos te causam paralisia por análise. Você se perde na imensidão do que precisa ser feito.",
    action:
      'Seu foco deve ser na fase de preparação. Antes de começar a trabalhar, gaste 10 minutos quebrando uma tarefa grande em 4 ou 5 microtarefas ridicularmente simples (ex: em vez de "Escrever relatório", use "Escrever introdução", "Inserir gráfico X", "Revisar ortografia").',
    focus:
      "Blocos de 45 minutos de foco por 15 minutos de descanso. Use a transição para revisar o planejamento.",
    color: "var(--yellow-01)",
  },
  E: {
    id: "inercia",
    title: "O Mestre da Inércia",
    subtitle: "Regra dos 5 Minutos",
    diagnosis:
      "Você está operando com zero tração. Métodos tradicionais vão falhar porque exigem muita força de vontade inicial.",
    action:
      "Negocie com você mesmo. Combine que vai abrir a task e trabalhar nela por apenas 5 minutos cronometrados. Se o alarme tocar e você ainda quiser parar, está liberado. 90% do esforço da preguiça está em tirar o corpo da inércia — uma vez que você começa, o cérebro tende a continuar.",
    focus:
      "Tiros curtíssimos e de baixíssimo atrito. Blocos de 15 a 20 minutos de foco por 5 a 10 de descanso.",
    color: "var(--purple-01, #a855f7)",
  },
};

export default profiles;
