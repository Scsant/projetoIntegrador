# 🎓 EscolaAgenda

Sistema SaaS profissional de gestão de agenda automatizada para escolas, desenvolvido com React, TypeScript, Tailwind CSS e Motion.

---

## 🚀 Visão Geral

**EscolaAgenda** é uma solução completa que resolve problemas críticos de gestão escolar:

- ✅ Automatização de agendas manuais
- ✅ Centralização de comunicação
- ✅ Economia de tempo administrativo
- ✅ Organização institucional

---

## 🎯 Funcionalidades Principais

### 👨‍🏫 Para Professores
- Agenda semanal e diária com horários de aula
- Upload e gestão de planos de aula
- Notificações automáticas
- Visão de eventos da escola
- Status de planos (enviado/pendente)

### 👔 Para Diretores
- Painel estratégico com métricas
- Validação de planos de aula
- Criação de eventos globais
- Envio de notificações institucionais
- Visão completa do calendário escolar

### 👥 Para Coordenadores
- Gestão do calendário escolar
- Organização de eventos
- Comunicação com professores
- Relatórios e estatísticas

---

## 📱 Páginas Implementadas

1. **Landing Page** (`/`)
   - Hero section com CTA
   - Problemas e soluções
   - Recursos principais
   - Testemunhos
   - Footer completo

2. **Autenticação** (`/login`, `/recuperar-senha`)
   - Login com validação
   - Recuperação de senha
   - Design limpo e profissional

3. **Seleção de Perfil** (`/selecionar-perfil`)
   - 3 perfis: Professor, Diretor, Coordenador
   - Cards interativos

4. **Dashboard Principal** (`/dashboard`)
   - Sidebar responsiva
   - 4 cards de estatísticas
   - Calendário resumido
   - Próximos eventos

5. **Agenda Escolar** (`/dashboard/agenda`)
   - 3 modos: Mensal, Semanal, Diário
   - Criação e edição de eventos
   - 5 categorias de eventos
   - Sistema de filtros

6. **Agenda do Professor** (`/dashboard/professor`)
   - Grade de horários escolares
   - Upload de planos de aula
   - Status visual de planos
   - Visão semanal/diária

7. **Painel da Direção** (`/dashboard/direcao`)
   - Validação de planos
   - Criação de eventos globais
   - Notificações institucionais
   - Métricas estratégicas

8. **Centro de Notificações** (`/dashboard/notificacoes`)
   - 4 tipos de notificações
   - Sistema de filtros
   - Marcar como lida
   - Estados vazios elegantes

9. **Design System** (`/design-system`)
   - Documentação completa
   - Exemplos interativos
   - Todos os componentes

---

## 🎨 Design System

### Componentes Reutilizáveis

- ✅ **Button** - 6 variantes, 3 tamanhos, estados
- ✅ **Card** - 4 variantes, subcomponentes
- ✅ **Badge** - 7 variantes, indicadores
- ✅ **Input** - Labels, erros, ícones
- ✅ **Skeleton** - 3 variantes, animações
- ✅ **EmptyState** - Estados vazios elegantes
- ✅ **ThemeToggle** - Dark/Light/System

### Paleta de Cores

| Modo | Background | Primary | Foreground |
|------|-----------|---------|------------|
| Light | `#ffffff` | `#2563eb` | `#0a0a0a` |
| Dark | `#0a0a0a` | `#3b82f6` | `#f5f5f5` |

### Categorias de Eventos

- **Aula** - Azul (`#3b82f6`)
- **Reunião** - Laranja (`#f97316`)
- **Planejamento** - Roxo (`#a855f7`)
- **Evento** - Verde (`#22c55e`)
- **Tutoria** - Ciano (`#06b6d4`)

---

## 🛠️ Tecnologias

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Estilização
- **Motion** (Framer Motion) - Animações
- **Lucide React** - Ícones profissionais
- **React Router** - Navegação

---

## 🌓 Dark Mode

Sistema completo de temas com 3 modos:

- ☀️ **Light** - Modo claro
- 🌙 **Dark** - Modo escuro
- 💻 **System** - Segue preferência do SO

Implementado com React Context e persistência no localStorage.

---

## 📱 Responsividade

Design **mobile-first** totalmente responsivo:

| Breakpoint | Tamanho | Dispositivo |
|-----------|---------|-------------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop wide |

---

## 🎭 Animações

Transições suaves com Motion:

- **Page transitions** - Fade in/out
- **Hover effects** - Scale + shadow
- **Modal animations** - Scale + fade
- **List items** - Slide in
- **Loading states** - Skeleton pulse

---

## 📊 Dados Mock

Sistema inclui dados mock realistas:

- 13 eventos de aula
- 5 eventos institucionais
- 3 validações pendentes
- 8 notificações (4 não lidas)
- 2 reuniões programadas
- 5 turmas de exemplo

---

## 🗺️ Estrutura de Rotas

```
/                          → Landing Page
/login                     → Login
/recuperar-senha           → Recuperação de Senha
/selecionar-perfil         → Seleção de Perfil
/dashboard                 → Dashboard Principal
/dashboard/agenda          → Agenda Escolar
/dashboard/professor       → Agenda do Professor
/dashboard/direcao         → Painel da Direção
/dashboard/notificacoes    → Centro de Notificações
/design-system             → Documentação do Design System
/*                         → Página 404
```

---

## 🎯 Diferenciais

1. **Design Profissional SaaS** - Interface moderna e limpa
2. **Dark Mode Nativo** - Suporte completo a temas
3. **Componentes Reutilizáveis** - Design System completo
4. **Animações Fluidas** - Experiência premium
5. **Mobile-First** - Responsivo em todos os dispositivos
6. **Multi-perfil** - 3 perfis com funcionalidades específicas
7. **Skeleton Loading** - Estados de carregamento elegantes
8. **Estados Vazios** - Feedback visual claro

---

## 📁 Estrutura de Arquivos

```
/src
  /app
    /components
      /ui              → Componentes do Design System
        Button.tsx
        Card.tsx
        Badge.tsx
        Input.tsx
        Skeleton.tsx
        EmptyState.tsx
        ThemeToggle.tsx
      AgendaPage.tsx
      ProfessorAgendaPage.tsx
      DirecaoPage.tsx
      NotificationsPage.tsx
      DashboardPage.tsx
      DesignSystemPage.tsx
      LandingPage.tsx
      LoginPage.tsx
      ...
    /contexts
      ThemeContext.tsx → Gerenciamento de tema
    App.tsx
    routes.ts
  /styles
    fonts.css
    theme.css         → Tokens de design
    global.css
  /imports            → Assets importados
```

---

## 🚀 Próximos Passos

### Backend (Sugerido)
- [ ] Integração com Supabase
- [ ] Autenticação real
- [ ] Upload de arquivos
- [ ] Banco de dados
- [ ] API RESTful

### Funcionalidades
- [ ] Módulo de alunos
- [ ] Chat interno
- [ ] Relatórios em PDF
- [ ] Exportação de dados
- [ ] Notificações push
- [ ] Calendário sincronizado

### Mobile
- [ ] Aplicativo React Native
- [ ] Notificações móveis
- [ ] Modo offline

---

## 📖 Documentação

- **Design System**: Ver `/DESIGN_SYSTEM.md`
- **Página Interativa**: Acesse `/design-system` no app

---

## 🎨 Exemplos Visuais

### Componentes

```tsx
// Button
<Button variant="primary" icon={<Plus />}>
  Criar Evento
</Button>

// Card
<Card variant="interactive" hover>
  <CardTitle>Título</CardTitle>
  <CardContent>Conteúdo</CardContent>
</Card>

// Badge
<Badge variant="success" dot>Online</Badge>

// Input
<Input 
  label="Email" 
  icon={<Mail />}
  error="Email inválido"
/>

// Empty State
<EmptyState
  icon={<Calendar />}
  title="Nenhum evento"
  action={{ label: "Criar", onClick: fn }}
/>
```

### Dark Mode

```tsx
import { useTheme } from './contexts/ThemeContext';

function Component() {
  const { theme, setTheme } = useTheme();
  
  return <ThemeToggle />;
}
```

---

## 🎯 Performance

- **Lazy Loading** - Componentes carregados sob demanda
- **Code Splitting** - Bundles otimizados
- **Tree Shaking** - Remoção de código não utilizado
- **Skeleton States** - Feedback instantâneo

---

## ♿ Acessibilidade

- ✅ Contraste mínimo WCAG AA
- ✅ Navegação por teclado
- ✅ Labels em formulários
- ✅ Estados de foco visíveis
- ✅ Textos alternativos
- ✅ Suporte a screen readers

---

## 📄 Licença

Projeto desenvolvido como solução SaaS educacional.

---

## 👥 Contribuindo

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📞 Suporte

Para dúvidas ou suporte, consulte a documentação do Design System ou abra uma issue.

---

**Desenvolvido com 💙 para transformar a gestão escolar**

---

**Versão**: 1.0.0  
**Última Atualização**: Março 2026
