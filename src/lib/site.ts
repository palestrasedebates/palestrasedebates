// Dados institucionais reais (extraídos do site original palestrasedebates.pt)

export const SITE = {
  name: 'Palestras e Debates',
  legalName: 'Palestras e Debates, Lda.',
  tagline: 'Divertida, Diferente e Dinâmica: o nosso método 3D',
  email: 'contacto@palestrasedebates.pt',
  phone: '+351 920 372 198',
  phoneRaw: '351920372198',
  // WhatsApp atende no número do Brasil; o número BR nunca aparece como texto, só no href.
  whatsapp: 'https://wa.me/5541988904213',
  address: 'Rua de Baixo de São Pedro, n.º 37, 9700-025, Angra do Heroísmo / Portugal',
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
  { label: 'Diagnóstico', to: '/diagnostico' },
  { label: 'Contacto', to: '/contato' },
] as const
