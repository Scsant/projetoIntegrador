# 🎨 EscolaAgenda Design System

## Visão Geral

Design System profissional SaaS para o EscolaAgenda, focado em clareza visual, hierarquia de informação, experiência do usuário e consistência.

---

## 🎯 Princípios de Design

1. **Clareza Visual** - Interfaces limpas e fáceis de entender
2. **Hierarquia** - Informação organizada por importância
3. **Consistência** - Componentes padronizados em todo o sistema
4. **Acessibilidade** - Design inclusivo e acessível
5. **Responsividade** - Mobile-first com adaptação perfeita

---

## 🎨 Paleta de Cores

### Cores Principais

#### Light Mode
- **Primary**: `#2563eb` (Blue 600)
- **Background**: `#ffffff` (White)
- **Foreground**: `#0a0a0a` (Near Black)
- **Border**: `rgba(0, 0, 0, 0.1)`

#### Dark Mode
- **Primary**: `#3b82f6` (Blue 500)
- **Background**: `#0a0a0a` (Near Black)
- **Foreground**: `#f5f5f5` (Off White)
- **Border**: `#262626` (Gray 900)

### Cores Semânticas

| Cor | Light | Dark | Uso |
|-----|-------|------|-----|
| Success | `#16a34a` | `#22c55e` | Sucesso, confirmações |
| Warning | `#ca8a04` | `#eab308` | Avisos, atenção |
| Danger | `#dc2626` | `#ef4444` | Erros, ações destrutivas |
| Info | `#9333ea` | `#a855f7` | Informações, dicas |

### Cores por Categoria de Evento

| Categoria | Cor | Uso |
|-----------|-----|-----|
| Aula | Blue (`#3b82f6`) | Aulas regulares |
| Reunião | Orange (`#f97316`) | Reuniões pedagógicas |
| Planejamento | Purple (`#a855f7`) | Sessões de planejamento |
| Evento | Green (`#22c55e`) | Eventos escolares |
| Tutoria | Cyan (`#06b6d4`) | Tutorias individuais |

---

## 📝 Tipografia

### Escala Tipográfica

```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Pesos de Fonte

```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Uso

- **H1**: 3xl, Semibold - Títulos principais de página
- **H2**: 2xl, Semibold - Títulos de seção
- **H3**: xl, Semibold - Subtítulos
- **H4**: lg, Medium - Títulos de card
- **Body**: base, Normal - Texto padrão
- **Caption**: sm, Normal - Legendas e metadados

---

## 📏 Espaçamento

### Sistema de Espaçamento (múltiplos de 4px)

```css
1 = 4px
2 = 8px
3 = 12px
4 = 16px
6 = 24px
8 = 32px
12 = 48px
16 = 64px
```

### Aplicações

- **Gaps entre elementos**: 2-4 (8-16px)
- **Padding de cards**: 6 (24px)
- **Margens entre seções**: 8-12 (32-48px)
- **Espaçamento de página**: 4-8 (16-32px)

---

## 🧩 Componentes

### Button

**Variantes**:
- `primary` - Ações principais (azul)
- `secondary` - Ações secundárias (cinza)
- `outline` - Ações terciárias (borda)
- `ghost` - Ações discretas (transparente)
- `danger` - Ações destrutivas (vermelho)
- `success` - Confirmações (verde)

**Tamanhos**:
- `sm` - px-3 py-1.5 text-sm
- `md` - px-4 py-2 text-base
- `lg` - px-6 py-3 text-lg

**Props**:
```tsx
<Button 
  variant="primary" 
  size="md"
  loading={false}
  disabled={false}
  icon={<Icon />}
  iconPosition="left"
>
  Label
</Button>
```

---

### Card

**Variantes**:
- `default` - Card padrão com borda
- `outlined` - Borda destacada
- `elevated` - Com sombra
- `interactive` - Clicável com hover

**Tamanhos de Padding**:
- `none` - Sem padding
- `sm` - p-4
- `md` - p-6
- `lg` - p-8

**Subcomponentes**:
- `CardHeader` - Cabeçalho do card
- `CardTitle` - Título
- `CardDescription` - Descrição
- `CardContent` - Conteúdo
- `CardFooter` - Rodapé

**Exemplo**:
```tsx
<Card variant="default" padding="md" hover>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

---

### Badge

**Variantes**:
- `primary` - Azul
- `secondary` - Cinza
- `success` - Verde
- `warning` - Amarelo
- `danger` - Vermelho
- `info` - Roxo
- `outline` - Com borda

**Tamanhos**:
- `sm` - px-2 py-0.5 text-xs
- `md` - px-2.5 py-1 text-sm
- `lg` - px-3 py-1.5 text-base

**Props**:
```tsx
<Badge variant="success" size="md" dot>
  Online
</Badge>
```

---

### Input

**Props**:
```tsx
<Input 
  label="Nome"
  placeholder="Digite seu nome"
  error="Campo obrigatório"
  helperText="Texto auxiliar"
  icon={<Icon />}
  iconPosition="left"
/>
```

**TextArea**:
```tsx
<TextArea 
  label="Descrição"
  rows={4}
  error="Erro"
  helperText="Ajuda"
/>
```

---

### Skeleton

**Variantes**:
- `text` - Para texto (h-4 rounded)
- `rectangular` - Para blocos (rounded-lg)
- `circular` - Para avatares (rounded-full)

**Animações**:
- `pulse` - Pulsação suave
- `wave` - Onda deslizante
- `none` - Sem animação

**Componentes Pré-configurados**:
- `SkeletonCard` - Card de loading
- `SkeletonList` - Lista de cards
- `SkeletonCalendar` - Calendário de loading

---

### EmptyState

**Props**:
```tsx
<EmptyState
  icon={<Calendar className="w-16 h-16" />}
  title="Nenhum evento"
  description="Descrição do estado vazio"
  action={{
    label: "Criar Evento",
    onClick: () => {},
    icon: <Plus />
  }}
/>
```

---

## 🌓 Dark Mode

### Implementação

O sistema usa React Context para gerenciar o tema:

```tsx
import { useTheme } from './contexts/ThemeContext';

function Component() {
  const { theme, setTheme, actualTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Tema: {actualTheme}
    </button>
  );
}
```

### Modos
- `light` - Modo claro
- `dark` - Modo escuro
- `system` - Segue preferência do sistema

### ThemeToggle Component

```tsx
<ThemeToggle />
```

Botão com 3 opções: Sol (light), Lua (dark), Monitor (system)

---

## 📱 Responsividade

### Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape / Desktop */
xl: 1280px  /* Desktop wide */
2xl: 1536px /* Desktop ultra-wide */
```

### Mobile-First

Todos os componentes seguem abordagem mobile-first:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 coluna no mobile, 2 no tablet, 3 no desktop */}
</div>
```

---

## 🎭 Animações

### Motion (Framer Motion)

**Transitions Padrão**:
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.3 }}
```

**Hover Effects**:
```tsx
whileHover={{ scale: 1.02, y: -4 }}
whileTap={{ scale: 0.98 }}
```

**Duração**:
- Rápida: 0.15s
- Média: 0.3s
- Lenta: 0.5s

---

## 🎨 Estados

### Interativos

- **Default** - Estado padrão
- **Hover** - Mouse sobre elemento
- **Active** - Elemento pressionado
- **Focus** - Elemento focado (teclado)
- **Disabled** - Elemento desabilitado

### Visuais

- **Loading** - Carregando dados (Skeleton)
- **Empty** - Sem dados (EmptyState)
- **Error** - Erro de validação
- **Success** - Operação bem-sucedida

---

## 📐 Grid System

### 12 Colunas

```tsx
<div className="grid grid-cols-12 gap-4">
  <div className="col-span-12 md:col-span-6 lg:col-span-4">
    {/* Responsivo */}
  </div>
</div>
```

### Layouts Comuns

**Dashboard**:
```tsx
<div className="grid lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* Main */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

**Cards Grid**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

---

## 🔤 Ícones

### Lucide React

Sistema utiliza **Lucide React** para ícones:

```tsx
import { Calendar, Bell, Settings } from 'lucide-react';

<Calendar className="w-5 h-5" />
```

### Tamanhos Padrão

- `w-4 h-4` - 16px (small)
- `w-5 h-5` - 20px (medium)
- `w-6 h-6` - 24px (large)
- `w-8 h-8` - 32px (extra large)

---

## 🎯 Boas Práticas

### Hierarquia Visual

1. Use tamanhos de fonte para criar hierarquia
2. Contraste de cores para destacar elementos importantes
3. Espaçamento para agrupar elementos relacionados
4. Consistência em todo o sistema

### Performance

1. Use Skeleton loading para estados de carregamento
2. Lazy loading para componentes pesados
3. Otimize imagens e assets
4. Minimize re-renders desnecessários

### Acessibilidade

1. Contraste mínimo 4.5:1 para texto
2. Suporte completo a teclado
3. Labels descritivos em inputs
4. Estados de foco visíveis
5. Textos alternativos em imagens

---

## 📦 Exportação de Componentes

Todos os componentes estão em `/src/app/components/ui/`:

```tsx
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { Input } from './components/ui/Input';
import { Skeleton } from './components/ui/Skeleton';
import { EmptyState } from './components/ui/EmptyState';
import { ThemeToggle } from './components/ui/ThemeToggle';
```

---

## 🔗 Referências

- **Tailwind CSS**: https://tailwindcss.com
- **Motion**: https://motion.dev
- **Lucide Icons**: https://lucide.dev
- **React**: https://react.dev

---

## 📄 Visualização

Acesse `/design-system` para ver todos os componentes em ação com exemplos interativos.

---

**Versão**: 1.0.0  
**Última Atualização**: Março 2026  
**Mantido por**: Equipe EscolaAgenda
