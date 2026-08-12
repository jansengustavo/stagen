<h1 align="center">Stagen</h1>

<p align="center">
  Aplicativo de produtividade full-stack: site institucional público e um dashboard
  autenticado com calendário de tarefas e timer estilo Pomodoro.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/Ant%20Design-0170FE?logo=antdesign&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white"/>
</p>

## Sobre

O Stagen é uma aplicação web de produtividade dividida em duas partes: um site
institucional público de apresentação e um painel autenticado onde o usuário
organiza tarefas em um calendário e usa um timer no estilo Pomodoro para
gerenciar o foco.

## Telas
 
<p align="center">
## Demo <img src="docs/screenshots/stagen-demo.gif" width="700" alt="Site em GIF"/> 

  <img src="docs/screenshots/home.png" width="700" alt="Home Page"/>
  <br/><br/>
  <img src="docs/screenshots/question.png" width="700" alt="Questionário"/>
  <br/><br/>
  <img src="docs/screenshots/timer.png" width="700" alt="Timer Pomodoro"/>
</p>

## Stack

**Front-end:** React 19, TypeScript, Vite, Ant Design
**Back-end:** Node.js, Express 5, TypeScript, MySQL

## Estrutura

```
stagen/
  frontend/   aplicação React + TypeScript (Vite)
  backend/    API em Node + Express + TypeScript, com MySQL
```

## Como rodar

Pré-requisitos: Node.js, npm e uma instância de MySQL.

```bash
sudo systemctl start mysql

# Back-end
cd backend
npm install
npm run dev

# Front-end (em outro terminal)
cd frontend
npm install
npm run dev
```

O front sobe em `http://localhost:5173/stagen/` e consome a API do back.

