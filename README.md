# Sistema de Avaliação de Vendedoras

Aplicativo web para avaliação de vendedoras em tablet, com dois perfis de acesso: Avaliação e Administrador.

## Funcionalidades

### Perfil Avaliação
- Tela com fotos das vendedoras ativas
- Sistema de avaliação por estrelas (1-5)
- Mensagem de agradecimento após voto
- Volta automática para tela inicial

### Perfil Administrador
- Dashboard com métricas (total de votos, média geral, vendedoras ativas)
- Gráficos de votos por vendedora e média de estrelas
- Filtros por período (dia, semana, mês)
- Gerenciamento de vendedoras (adicionar, editar, desabilitar)

## Stack

- **Frontend:** React + Vite + TypeScript
- **Estilização:** Tailwind CSS
- **Gráficos:** Recharts
- **Ícones:** Lucide React
- **Roteamento:** React Router
- **Banco de Dados:** Supabase (opcional, usa localStorage por padrão)
- **Deploy:** Vercel

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

## Estrutura do Projeto

```
src/
├── components/
│   └── AdminLayout.tsx    # Layout do painel admin
├── lib/
│   ├── AuthContext.tsx     # Contexto de autenticação
│   ├── database.ts         # Camada de dados (localStorage)
│   └── supabase.ts         # Configuração Supabase
├── pages/
│   ├── LoginPage.tsx       # Seleção de perfil
│   ├── VotacaoPage.tsx     # Tela de votação
│   ├── DashboardPage.tsx   # Dashboard do admin
│   └── GerenciarPage.tsx   # CRUD de vendedoras
├── App.tsx                 # Rotas da aplicação
└── main.tsx               # Entry point
```

## Deploy no Vercel

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. O deploy será automático a cada push no branch principal