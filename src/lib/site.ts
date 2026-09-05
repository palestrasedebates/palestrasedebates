// Dados institucionais reais (extraídos do site original palestrasedebates.pt)

export const SITE = {
  name: 'Palestras e Debates',
  legalName: 'Palestras e Debates, Lda.',
  tagline: 'Divertida, Diferente e Dinâmica — o nosso método 3D',
  email: 'contacto@palestrasedebates.pt',
  phone: '+351 920 372 198',
  phoneRaw: '351920372198',
  whatsapp: 'https://wa.me/351920372198',
  address: 'Rua de Baixo de São Pedro, n.º 37 — 9700-025, Angra do Heroísmo / Portugal',
  maps: 'https://maps.app.goo.gl/5RY1BeMxHLf5kw1HA',
  social: {
    instagram: 'https://www.instagram.com/palestrasedebates',
    facebook: 'https://www.facebook.com/palestrasedebates',
  },
} as const

export const NAV = [
  { label: 'Início', to: '/' },
  { label: 'Empresa', to: '/empresa' },
  { label: 'Palestras', to: '/palestras' },
  { label: 'Serviços', to: '/#servicos' },
  { label: 'Contacto', to: '/contato' },
] as const
