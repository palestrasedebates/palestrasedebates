// Conteúdo textual literal do site Palestras e Debates.

export type Slide = {
  img: string
  title: string
  subtitle?: string
  cta?: { label: string; href: string }
}

export const HERO_SLIDES: Slide[] = [
  {
    img: '/img/01.jpg',
    title: 'FORMAÇÕES completas! Palestras, Cursos e Formações',
    cta: { label: 'Conheça nossos serviços!', href: '/#servicos' },
  },
  {
    img: '/img/15.jpg',
    title: 'Palestras e workshops!',
    subtitle:
      'Sobre LIDERANÇA INSPIRADORA, MENTALIDADE VENCEDORA e INTELIGÊNCIA PRODUTIVA',
    cta: { label: 'Chama aqui no Zap!', href: 'https://wa.me/351920372198' },
  },
  {
    img: '/img/02.jpg',
    title: 'Palestras sobre Comportamento e Gestão de Equipas',
    cta: { label: 'Conheça nossas palestras', href: '/palestras' },
  },
  {
    img: '/img/12.jpg',
    title: 'LANÇAMENTO! Contrato de fidelização',
    subtitle:
      'Todas as exigências legais para formações garantidas! Valor com super desconto, prioridade na agenda, atendimento express e certificados online em 24h.',
    cta: { label: 'Fale connosco', href: '/contato' },
  },
  {
    img: '/img/03.jpg',
    title: 'Intervenções nos setores',
    subtitle: 'Abordagem direta e muito eficaz!',
    cta: { label: 'Solicite orçamento', href: '/contato' },
  },
  {
    img: '/img/04.jpg',
    title: 'Workshop de Liderança',
    cta: { label: 'Conheça nossas palestras', href: '/palestras' },
  },
]

export type Servico = {
  img: string
  title: string
  text: string
}

export const SERVICOS: Servico[] = [
  {
    img: '/img/servicos_sipat.jpg',
    title: 'SIPAT e Eventos',
    text: 'Palestras, palestras-espetáculo, teatros, sketches e intervenções nos setores. Ainda, ginástica laboral, aula de zumba e check up de saúde. Produção da sua convenção corporativa: deixe tudo com a nossa equipa e fique em paz.',
  },
  {
    img: '/img/servicos_palestras.jpg',
    title: 'Palestras',
    text: 'A nossa equipa multidisciplinar entregar-lhe-á as melhores soluções com as várias opções de palestras e show talk nas áreas da saúde, segurança no trabalho, assédio e gestão de pessoas e equipas, dirigidas a contextos e públicos específicos, e tudo isto 100% in company.',
  },
  {
    img: '/img/servicos_cursos.jpg',
    title: 'Cursos',
    text: 'Cursos de formação e reciclagem. Cursos livres nos mais diversos temas, formações e workshops certificados sobre inteligência emocional, atendimento ao cliente, liderança, vendas, gestão de conflitos, gestão financeira e terapias alternativas.',
  },
  {
    img: '/img/servicos_avaliacoes.jpg',
    title: 'Consultorias',
    text: 'Consultorias de saúde, ambientais, segurança no trabalho e vendas. Consultoria em avaliação e gestão de riscos, mapeamento de processos, produção e gestão documental para garantia da qualidade.',
  },
]

// Carrossel "Nossas palestras" da home — usa as imagens em /img/palestras
export const PALESTRAS_DESTAQUE = [
  { img: '/img/palestras/015.jpg', title: 'Palestras externas' },
  { img: '/img/palestras/010.jpg', title: 'Intervenções nos setores' },
  { img: '/img/palestras/003.jpg', title: 'Workshop de Liderança' },
  { img: '/img/palestras/006.jpg', title: 'A comunicação na era da dependência tecnológica' },
  { img: '/img/palestras/014.jpg', title: 'Qualidade de vida' },
  { img: '/img/palestras/017.jpg', title: 'Palestra interativa "On Time"' },
  { img: '/img/palestras/008.jpg', title: 'As ISTs, não!' },
  { img: '/img/palestras/013.jpg', title: 'Saúde do homem em foco' },
  { img: '/img/palestras/001.jpg', title: 'Primeiros socorros sem mimimi' },
  { img: '/img/palestras/004.jpg', title: 'Comportamento seguro em 1º lugar' },
  { img: '/img/palestras/005.jpg', title: 'Os 4Fs do sucesso' },
  { img: '/img/palestras/011.jpg', title: 'A saúde da mulher moderna' },
]

export const CATEGORIAS = [
  {
    key: 'saude',
    title: 'Saúde',
    desc: 'Conheça todo o nosso rol de palestras voltadas à SAÚDE (física e mental)!',
  },
  {
    key: 'seguranca',
    title: 'Segurança do Trabalho',
    desc: 'Conheça todo o nosso rol de palestras voltadas à SEGURANÇA DO TRABALHO!',
  },
  {
    key: 'gestao',
    title: 'Gestão de Equipas',
    desc: 'Conheça as palestras com temas de COMPORTAMENTO e GESTÃO de equipas!',
  },
] as const

export type CategoriaPalestra = {
  key: string
  title: string
  desc: string
  imgs: string[]
  destaques: string[]
  temas: string[]
}

export const CATEGORIAS_PALESTRAS: CategoriaPalestra[] = [
  {
    key: 'saude',
    title: 'Palestras: Saúde',
    desc: 'Conheça todo o nosso rol de palestras voltadas à SAÚDE (física e mental)!',
    imgs: ['/img/palestras/014.jpg', '/img/palestras/012.jpg', '/img/palestras/008.jpg', '/img/palestras/013.jpg', '/img/palestras/011.jpg'],
    destaques: [
      'Vivendo com qualidade e aprendendo a conviver com o STRESS',
      'Saúde mental e emocional',
      'Vai continuar a brincar? As Infecções Sexualmente Transmissíveis, NÃO!',
      'Quebrando paradigmas, saúde do HOMEM em foco!',
      'A saúde da MULHER moderna: viva e seja FELIZ!',
    ],
    temas: [
      'Combate ao assédio',
      'Doenças virais',
      'Qualidade de vida',
      'IST / DST / SIDA',
      'Saúde do homem',
      'Saúde da mulher',
      'Prevenção das drogas',
      'Saúde mental',
      'Perturbações do sono',
      'Higiene e saúde oral',
      'Ergonomia',
    ],
  },
  {
    key: 'seguranca',
    title: 'Palestras: Segurança do Trabalho',
    desc: 'Conheça todo o nosso rol de palestras voltadas à SEGURANÇA DO TRABALHO!',
    imgs: ['/img/palestras/002.jpg', '/img/palestras/004.jpg', '/img/palestras/001.jpg'],
    destaques: [
      'Meio ambiente, ética e assertividade na SEGURANÇA DO TRABALHO: a sua vida num segundo!',
      'Comportamento seguro em 1º lugar: a sua FAMÍLIA quer-o de volta!',
      'MÃO, PANO e ÁGUA: Primeiros Socorros sem mimimi!',
    ],
    temas: [
      'Primeiros socorros',
      'Segurança no trabalho',
      'Cuidado com as mãos / uso de EPI e EPC',
      'Comportamento seguro e preventivo',
      'Combate ao assédio',
      'LER / DORT',
      'Direção defensiva',
      'Condução segura e económica',
      'Manuseio de produtos químicos',
    ],
  },
  {
    key: 'gestao',
    title: 'Palestras: Gestão e Comportamento de Equipas',
    desc: 'Conheça as palestras com temas de COMPORTAMENTO e GESTÃO de equipas!',
    imgs: ['/img/palestras/003.jpg', '/img/palestras/006.jpg', '/img/palestras/005.jpg', '/img/palestras/009.jpg'],
    destaques: [
      'Workshop de Liderança',
      'A COMUNICAÇÃO e o RELACIONAMENTO na era da dependência tecnológica',
      'Qual o seu PROPÓSITO? A sua mente aberta pelos 4Fs do SUCESSO!',
      'Não importa o quanto você ganha, e sim o quanto gasta. Vamos PLANEAR juntos?',
    ],
    temas: [
      'Motivação (palestra-show)',
      'Inovação e criatividade',
      'Qualidade total 5S e 8S',
      'Sustentabilidade, ambiente e cidadania',
      'Planeamento económico',
      'Gestão do risco',
      'Gestão do serviço ao cliente',
      'Dependência tecnológica',
      'Vendas de impacto',
      'Ética, postura profissional e marketing pessoal',
      'Combate ao assédio',
    ],
  },
]

export const PALESTRAS_ESPECIAIS = [
  {
    title: 'Palestras interativas: On Time',
    img: '/img/palestras/017.jpg',
    text: 'Utilizamos tecnologia para promover interatividade em tempo real entre os participantes.',
  },
  {
    title: 'A comunicação na era da dependência tecnológica',
    img: '/img/palestras/006.jpg',
    text: 'Uma reflexão sobre relacionamento e comunicação num mundo hiperconectado.',
  },
  {
    title: 'Palestras externas',
    img: '/img/palestras/015.jpg',
    text: 'Solução rápida e segura, levada até onde a sua equipa está.',
  },
  {
    title: 'Intervenções nos setores',
    img: '/img/palestras/010.jpg',
    text: 'Abordagem direta no chão de fábrica e nos setores: muito eficaz!',
  },
  {
    title: 'Palestras e cursos via webconferência',
    img: '/img/palestras/018.jpg',
    text: 'Todo o conteúdo à distância, com a mesma qualidade e energia.',
  },
]
