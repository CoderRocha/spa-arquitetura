export type Locale = 'pt-BR' | 'en'

type Message = { title: string; detail: string }

type Messages = {
  unauthorized: Message
  notFound: Message
  routeNotFound: Message
  invalid: Message
  invalidFile: Message
  nameTaken: Message & { field: string }
  emailTaken: Message & { field: string }
  invalidCredentials: Message
  tooMany: (seconds: number) => Message
  generic: Message
}

const messages: Record<Locale, Messages> = {
  'pt-BR': {
    unauthorized: { title: 'Sessão expirada', detail: 'Entre novamente para continuar.' },
    notFound: { title: 'Item não encontrado', detail: 'O item pode ter sido excluído.' },
    routeNotFound: { title: 'Rota não encontrada', detail: 'Confira o endereço da requisição.' },
    invalid: { title: 'Dados inválidos', detail: 'Revise os campos destacados.' },
    invalidFile: { title: 'Arquivo inválido', detail: 'Envie uma imagem PNG, JPG ou WebP com até 2 MB.' },
    nameTaken: {
      title: 'Nome em uso',
      detail: 'Já existe um item com esse nome.',
      field: 'Já existe um item com esse nome.',
    },
    emailTaken: {
      title: 'E-mail em uso',
      detail: 'Já existe uma conta com esse e-mail.',
      field: 'Este e-mail já está em uso.',
    },
    invalidCredentials: { title: 'Credenciais inválidas', detail: 'E-mail ou senha incorretos.' },
    tooMany: (seconds) => ({
      title: 'Muitas tentativas',
      detail: `Aguarde ${seconds} segundos e tente novamente.`,
    }),
    generic: { title: 'Algo deu errado', detail: 'Tente novamente em instantes.' },
  },
  en: {
    unauthorized: { title: 'Session expired', detail: 'Sign in again to continue.' },
    notFound: { title: 'Item not found', detail: 'The item may have been deleted.' },
    routeNotFound: { title: 'Route not found', detail: 'Check the request address.' },
    invalid: { title: 'Invalid data', detail: 'Review the highlighted fields.' },
    invalidFile: { title: 'Invalid file', detail: 'Send a PNG, JPG or WebP image up to 2 MB.' },
    nameTaken: {
      title: 'Name in use',
      detail: 'An item with this name already exists.',
      field: 'An item with this name already exists.',
    },
    emailTaken: {
      title: 'Email in use',
      detail: 'An account with this email already exists.',
      field: 'This email is already in use.',
    },
    invalidCredentials: { title: 'Invalid credentials', detail: 'Wrong email or password.' },
    tooMany: (seconds) => ({
      title: 'Too many requests',
      detail: `Wait ${seconds} seconds and try again.`,
    }),
    generic: { title: 'Something went wrong', detail: 'Please try again in a moment.' },
  },
}

export const localeOf = (request: Request): Locale =>
  request.headers.get('accept-language')?.toLowerCase().startsWith('en') ? 'en' : 'pt-BR'

export const messagesFor = (locale: Locale) => messages[locale]
