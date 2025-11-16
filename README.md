# 💊 Cuidado com a Saúde - Health Care App

> Gerenciador familiar de saúde para idosos - 100% gratuito, offline-first e PWA

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PWA](https://img.shields.io/badge/PWA-ready-orange.svg)

## 📖 Sobre o Projeto

Aplicação web completa para gerenciamento de saúde de idosos, permitindo que famílias acompanhem medicamentos, consultas médicas e exames de forma colaborativa e segura.

### ✨ Funcionalidades Principais

- 💊 **Controle de Medicamentos** - Horários, dosagens e confirmação de tomadas
- 📅 **Agenda de Consultas** - Calendário visual com lembretes
- 📄 **Gestão de Exames** - Upload e visualização de PDFs e imagens
- 👨‍👩‍👧‍👦 **Acesso Familiar** - Compartilhamento seguro entre membros da família
- 🔔 **Notificações Inteligentes** - Lembretes automáticos no navegador
- 📱 **PWA** - Instalável como app no celular
- 🔌 **Offline First** - Funciona sem internet e sincroniza automaticamente
- 🔐 **Segurança** - Row Level Security (RLS) com controle de permissões

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [GitHub](https://github.com) (gratuita)
- Conta na [Vercel](https://vercel.com) (gratuita)

### Instalação Local

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/health-care-app.git
cd health-care-app

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O app estará rodando em `http://localhost:5173`

---

## ⚙️ Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse <https://supabase.com>
2. Crie um novo projeto
3. Anote a **Project URL** e **anon public key**

### 2. Executar SQL do Banco de Dados

No Supabase Dashboard, vá em **SQL Editor** e execute:

```sql
-- Execute o conteúdo de database/schema.sql
-- Depois execute database/rls.sql
```

### 3. Criar Bucket de Storage

```sql
-- No SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-documents', 'medical-documents', false);
```

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

---

## 📦 Build e Deploy

### Build Local

```bash
# Gerar build de produção
npm run build

# Testar build localmente
npm run preview
```

### Deploy na Vercel

#### Via Interface Web

1. Acesse <https://vercel.com/new>
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Clique em **Deploy**

#### Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 📱 Instalar como PWA

### Android (Chrome/Edge)

1. Abra o site no navegador
2. Menu (3 pontos) → **Adicionar à tela inicial**
3. Confirme a instalação

### iOS (Safari)

1. Abra o site no Safari
2. Botão **Compartilhar** (⬆️)
3. **Adicionar à Tela de Início**
4. Confirme

---

## 🏗️ Estrutura do Projeto

health-care-app/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── auth/        # Autenticação
│   │   ├── dashboard/   # Dashboard
│   │   ├── medications/ # Medicamentos
│   │   ├── appointments/# Consultas
│   │   ├── documents/   # Exames
│   │   ├── family/      # Família
│   │   ├── parents/     # Pais/Idosos
│   │   └── ui/          # Componentes UI
│   ├── hooks/           # React Hooks
│   ├── lib/             # Bibliotecas
│   ├── pages/           # Páginas
│   ├── stores/          # Zustand Stores
│   └── styles/          # CSS
├── database/            # SQL Scripts
└── ...

---

## 🔧 Tecnologias Utilizadas

### Frontend

- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Ícones

### Backend & Banco

- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados
- **Row Level Security** - Segurança

### Estado & Dados

- **Zustand** - State management
- **React Query** - Data fetching
- **Dexie.js** - IndexedDB (offline)

### PWA & Notificações

- **Vite PWA** - Service Worker
- **Web Notifications API** - Notificações
- **Web Share API** - Compartilhamento

---

## 📖 Guia de Uso

### Para Administradores da Família

1. **Cadastrar Idoso**

   - Menu → Pais → Adicionar Novo
   - Preencha dados básicos e de saúde

2. **Adicionar Medicamentos**

   - Selecione o idoso
   - Remédios → Adicionar
   - Configure horários e dosagens

3. **Agendar Consultas**

   - Consultas → Nova Consulta
   - Preencha médico, local e data

4. **Convidar Familiares**
   - Família → Convidar Membro
   - Configure permissões (visualizar, editar, deletar)

### Para Membros da Família

1. **Confirmar Medicamentos**

   - Ver medicamentos pendentes no dashboard
   - Clicar em "Confirmar Tomada"

2. **Receber Notificações**

   - Permitir notificações quando solicitado
   - Receber lembretes automáticos

3. **Upload de Exames**
   - Exames → Upload
   - Selecionar PDF ou foto
   - Adicionar informações

---

## 🔐 Segurança e Privacidade

- ✅ Autenticação via Supabase Auth
- ✅ Row Level Security (RLS) no banco
- ✅ HTTPS obrigatório
- ✅ Dados criptografados em trânsito
- ✅ Storage privado (não público)
- ✅ Tokens JWT com expiração
- ✅ Políticas de acesso granulares

---

## 🐛 Troubleshooting

### Erro: "Invalid API credentials"

```bash
# Verifique as variáveis de ambiente
cat .env

# Confirme URL e chave do Supabase no Dashboard
```

### Erro: "Permission denied"

```sql
-- Execute os scripts RLS no Supabase
-- database/rls.sql
```

### App não funciona offline

```bash
# Certifique-se que o PWA está configurado
npm run build
npm run preview

# Abra DevTools > Application > Service Workers
# Deve aparecer "sw.js" ativo
```

### Notificações não aparecem

1. Verifique permissões no navegador (Settings)
2. Certifique-se que está em HTTPS
3. Teste com `sendTestNotification()`

---

## 📊 Monitoramento

### Vercel Dashboard

- Analytics de uso
- Logs de erros
- Performance metrics

### Supabase Dashboard

- Database usage
- Auth users
- Storage usage
- API requests

---

## 🎯 Roadmap

### v1.1 (Próxima versão)

- [ ] Exportar relatórios PDF
- [ ] Gráficos de adesão
- [ ] Integração Google Calendar
- [ ] Dark mode

### v1.2 (Futuro)

- [ ] Chat familiar
- [ ] Videochamada (telemedicina)
- [ ] App nativo (React Native)
- [ ] Integração wearables

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## ❤️ Agradecimentos

- Minha família que inspirou este projeto
- Comunidade open source
- Supabase, Vercel e React teams

---

### Desenvolvido com ❤️ para facilitar o cuidado com nossos idosos
