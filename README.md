# Microblog Full Stack

Projeto de atividade academica para construir um microblog completo com backend em Node.js/Fastify/Prisma/PostgreSQL e frontend em React/Vite/Tailwind.

## Objetivo
- Cadastro de usuario
- Login com JWT
- Perfil publico por username
- Criacao, edicao e exclusao de posts pelo dono
- Feed publico de posts

## Stack
- Backend: Node.js, Fastify, TypeScript, Prisma, PostgreSQL, JWT
- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios

## Estrutura
```txt
.
|-- backend/
|-- frontend/
|-- .vscode/
|-- README.md
`-- tsconfig.json
```

## Como executar

### 1. Banco de dados
O projeto esta configurado para usar PostgreSQL local:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/microblog"
```

Se necessario, use o arquivo `backend/.env.example` como referencia.

### 2. Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

API esperada em:
- `http://localhost:3333`
- `http://localhost:3333/health`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Aplicacao esperada em:
- `http://localhost:5173`

### 4. Subir tudo pela raiz
```bash
npm install
npm run dev
```

Esse comando sobe backend e frontend juntos.

## Build
```bash
cd backend
npm run build

cd ../frontend
npm run build
```

## Regras de negocio
1. Visitantes podem ver feed, perfil e posts.
2. Usuario autenticado pode criar e gerenciar apenas seus posts.
3. Permissoes devem ser validadas no backend.
4. O frontend nao e camada de seguranca.

## Observacao
O repositorio contem a implementacao completa do projeto em `backend/` e `frontend/`, pronta para execucao local e publicacao.
