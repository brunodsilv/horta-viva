# 🌱 Horta Viva - Aventura Verde

Bem-vindo ao **Horta Viva**, uma aplicação web focada em engajar estudantes na manutenção e aprendizado sobre hortas escolares através da gamificação. 

Este projeto transforma tarefas do dia a dia (como regar plantas ou tirar ervas daninhas) em "Missões" interativas, onde os alunos ganham pontos de experiência (XP) ao completá-las.

## 🚀 Status do Projeto
Em desenvolvimento ativo. (Fase atual: Construção do painel de missões do aluno).

## 🎯 Funcionalidades Atuais

* **Autenticação Segura:** Sistema de Login e Cadastro utilizando Firebase Authentication.
* **Controle de Acessos (Role-Based):** Rotas e interfaces dinâmicas que se adaptam dependendo se o utilizador é **Aluno** ou **Professor**.
* **Base do Mestre (Painel do Professor):**
  * Criação de missões com título, descrição e valor de recompensa (XP).
  * Exclusão de missões.
  * Sincronização em tempo real do mapa de missões utilizando Firestore (`onSnapshot`).
* **Dashboard Inteligente:** Reconhece o jogador logado e adapta as opções da tela.
* **Interface Gamificada:** Design responsivo e atrativo focado na experiência do usuário (UX), utilizando Tailwind CSS.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com as seguintes ferramentas:

* **React (com Vite):** Para uma renderização rápida e componentização eficiente.
* **Tailwind CSS:** Para a estilização rápida e responsiva de toda a interface gamificada.
* **Firebase (Backend as a Service):**
  * *Authentication:* Para gestão de usuários (E-mail e Senha).
  * *Firestore Database:* Banco de dados NoSQL para armazenar os perfis dos usuários e as missões.
* **GitHub Pages:** Para hospedagem e deploy contínuo.
