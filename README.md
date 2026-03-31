# 🧠 MindScribe Web - O Seu Cérebro Digital (Evernote Clone)

Bem-vindo ao repositório Front-end do **MindScribe**, uma aplicação web elegante e moderna de anotações projetada para oferecer uma experiência de escrita fluida, reativa e sem interrupções – inspirada nos maiores aplicativos de produtividade do mercado.

Este projeto foi construído como um portfólio prático para aplicar conceitos avançados de Front-end e Engenharia de Software utilizando **Angular**, comunicando-se de forma consistente com uma **API RESTful** (nativamente desenvolvida em Spring Boot).

## 🚀 Tecnologias e Arquitetura

O projeto utiliza tecnologias modernas e as mais recentes boas práticas para garantir manutenção, escalabilidade e altíssima performance:

*   **Angular v21** (Construído totalmente com a moderna arquitetura de *Standalone Components*, garantindo um código mais limpo por não depender do tradicional `NgModules`).
*   **TypeScript** para garantir segurança na tipagem e manutenibilidade na vida útil da aplicação.
*   **RxJS** para orquestração de eventos assíncronos, gerenciamento de estado e reatividade real, com uso robusto de `Subjects` e `BehaviorSubjects`.
*   **CSS3 e HTML5 Nativos**, com base construída do zero, focando em customização profunda e UI refinada ao invés da interdependência massiva de bibliotecas de componentes prontas.

## ✨ Principais Funcionalidades

### 1. Módulo de Autenticação (Segurança e Sessão)
*   **Login & Registro:** Telas com formulários responsivos dedicados ao engajamento do usuário. Tratamento reativo em tempo real de erros de autenticação (HTTP 400, 401) com _feedbacks_ visuais na tela.
*   **Tokens JWT:** Integração fluida em armazenagem via _localStorage_ (`auth_token`), com uso interceptadores HTTP para enviar de forma silenciosa e automática credenciais pelo Header em requisições logadas.

### 2. Painel Interativo de Anotações (Gestão Otimizada de Tarefas)
*   **Criação Dinâmica de Layout (Sem Recarregamentos):** Ao criar uma nota, a representação gráfica em tela responde em milissegundos, gerida pelo `ChangeDetectorRef` nativo do Angular para evitar _reloads_.
*   **Auto-Save Inteligente:** O fluxo natural de escrita nunca é afetado. O operador `debounceTime` do RxJS aguarda pausas curtas na digitação e realiza salvamentos contínuos na base de dados de forma transparente na nuvem.
*   **CRUD Intuitivo:** Capacidade rica e responsiva de gerir e excluir notas do inventário através de lógicas robustas que evitam engasgos na detecção da interface do usuário.

### 3. Interface Complexa e Desacoplada
*   **Ações Transversais:** Um sistema de barramento isolado (`NoteService`) onde a _Sidebar_ se torna um controle mestre global: dispara ações de busca ou criação que componentes independentes como a visualização da *Home* escutam ativamente e executam em uníssono – princípio puro de baixo acoplamento!
*   **Transições Visuais Lógicas:** Mudanças em real-time entre visualização dos "Dashboards" contra o leitor imersivo da nota sendo editada.

## 🛠️ Desafios Técnicos Solucionados

Durante o desenvolvimento do Front-end em Angular v21, princípios sérios da engenharia foram atacados:

*   **Comunicação Reativa Eficiente:** Superou os padrões de injeção e roteamento pesado delegando fluxos contínuos entre partes não-parentes da UI por intermédio reativo e Observables (`note.ts`, `isEditorOpen`).
*   **Prevenção de _Memory Leaks_:** Controle microscópico do ciclo de vida nos módulos de serviço e paginas e destruição adequada de _Subscriptions_ (`ngOnDestroy`).
*   **Sincronicidade de Tela x Estado:** Lógica state-of-the-art na gerência dos menus paralelos em Dropdown (sem dependências modulares complexas do Javascript tradicional), manipulando a renderização a nível dos pixels através de cliques globais isolados.

## 📁 Estrutura Clean do Projeto

O código-fonte reflete o isolamento completo por domínios de negócio com fácil navegação:

```text
src/
└── app/
    ├── components/ # Pedaços atômicos e reutilizáveis da UI (Ex: Sidebar, Header estilizados).
    ├── layout/     # Definições modulares da casca das páginas (Ex: MainLayout que abriga rotas fluindo).
    ├── models/     # Objetos vitais e tipagens que transacionam com API (Ex: Payload e DTOs de Note).
    ├── pages/      # View central das rotas renderizadas ativamente (Login, Registros e Dashboard/Home).
    ├── services/   # Camada de Injeção para regras de negócio pesadas, Interceptações Web e requisições HTTP REST.
    ├── app.routes  # Tabela modular para lazy-loading (se preciso) e redirecionamentos.
    └── app.config  # O Cérebro condutor das injeções de provedores do Angular.
```

## ⚙️ Como executar a aplicação localmente

**Pré-requisitos Necessários:** Você precisará ter o ecosistema **Node.js** e o **Angular CLI** adequados instalados globalmente. Adicionalmente, você precisa ter instanciada sua API Java Spring Boot (`http://localhost:8080`) para viabilizar as chamadas backend!

1. **Clone este Repositório:**
   ```bash
   git clone <SUA_URL_DO_REPOSITÓRIO>
   cd mindscribe-web
   ```

2. **Baixe os Pacotes da Aplicação:**
   ```bash
   npm install
   ```

3. **Inicie o Servidor Front-end em Ambiente de Dev:**
   ```bash
   ng serve
   ```

4. **Aplicação Pronta:**
   Abra seu navegador favorito e inicie a imersão em: [http://localhost:4200](http://localhost:4200)

---
*Desenvolvido com dedicação, padrões Clean Code e Arquitetura Reativa.*
