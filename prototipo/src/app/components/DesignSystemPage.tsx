import { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Input, TextArea } from './ui/Input';
import { Skeleton, SkeletonCard, SkeletonList, SkeletonCalendar } from './ui/Skeleton';
import { EmptyState } from './ui/EmptyState';
import { 
  Plus, 
  Search, 
  Download, 
  Trash2,
  Calendar,
  Bell,
  Settings,
  Upload
} from 'lucide-react';

export function DesignSystemPage() {
  const [showSkeleton, setShowSkeleton] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Design System
              </h1>
              <p className="text-lg text-gray-600">
                Componentes reutilizáveis do EscolaAgenda
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Colors */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cores</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Primary', class: 'bg-blue-600' },
              { name: 'Secondary', class: 'bg-gray-600' },
              { name: 'Success', class: 'bg-green-600' },
              { name: 'Warning', class: 'bg-yellow-600' },
              { name: 'Danger', class: 'bg-red-600' },
              { name: 'Info', class: 'bg-purple-600' }
            ].map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={`h-24 rounded-lg ${color.class} shadow-md`} />
                <p className="text-sm font-medium text-gray-700">{color.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Tipografia</h2>
          <div className="space-y-4 bg-white p-6 rounded-xl border border-gray-200">
            <h1 className="text-gray-900">Heading 1 - 3xl</h1>
            <h2 className="text-gray-900">Heading 2 - 2xl</h2>
            <h3 className="text-gray-900">Heading 3 - xl</h3>
            <h4 className="text-gray-900">Heading 4 - lg</h4>
            <p className="text-gray-700">Parágrafo - base</p>
            <p className="text-sm text-gray-600">Texto pequeno - sm</p>
            <p className="text-xs text-gray-500">Texto extra pequeno - xs</p>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Botões</h2>
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Variantes</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tamanhos</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* With Icons */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Com Ícones</h3>
              <div className="flex flex-wrap gap-4">
                <Button icon={<Plus className="w-4 h-4" />}>Criar Novo</Button>
                <Button icon={<Download className="w-4 h-4" />} variant="secondary">Download</Button>
                <Button icon={<Trash2 className="w-4 h-4" />} iconPosition="right" variant="danger">
                  Excluir
                </Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Estados</h3>
              <div className="flex flex-wrap gap-4">
                <Button loading>Loading...</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Padrão</CardTitle>
                <CardDescription>Descrição do card</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Conteúdo do card com informações relevantes.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Ação</Button>
              </CardFooter>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Card Outlined</CardTitle>
                <CardDescription>Com borda destacada</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Variação com borda mais visível.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Card Elevado</CardTitle>
                <CardDescription>Com sombra</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Variação com shadow elevada.
                </p>
              </CardContent>
            </Card>

            <Card variant="interactive" hover>
              <CardHeader>
                <CardTitle>Card Interativo</CardTitle>
                <CardDescription>Clicável com hover</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Este card tem efeito hover.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Badges</h2>
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Variantes</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tamanhos</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>

            {/* With Dot */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Com Indicador</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary" dot>Ativo</Badge>
                <Badge variant="success" dot>Online</Badge>
                <Badge variant="warning" dot>Pendente</Badge>
                <Badge variant="danger" dot>Erro</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Inputs</h2>
          <div className="max-w-2xl space-y-6">
            <Input 
              label="Nome Completo" 
              placeholder="Digite seu nome"
              helperText="Seu nome será usado em notificações"
            />
            <Input 
              label="Email" 
              type="email"
              placeholder="seu@email.com"
              icon={<Search className="w-4 h-4" />}
            />
            <Input 
              label="Telefone" 
              error="Número de telefone inválido"
              placeholder="(00) 00000-0000"
            />
            <TextArea 
              label="Descrição"
              placeholder="Digite uma descrição..."
              helperText="Máximo de 500 caracteres"
            />
          </div>
        </section>

        {/* Skeleton */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Skeleton Loading</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button onClick={() => setShowSkeleton(!showSkeleton)}>
                {showSkeleton ? 'Esconder' : 'Mostrar'} Skeleton
              </Button>
            </div>
            
            {showSkeleton && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Skeleton</h3>
                  <SkeletonCard />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista Skeleton</h3>
                  <SkeletonList items={3} />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendário Skeleton</h3>
                  <SkeletonCalendar />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Empty States */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Estados Vazios</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <EmptyState
                icon={<Calendar className="w-16 h-16" />}
                title="Nenhum evento"
                description="Você ainda não criou nenhum evento. Comece criando seu primeiro evento."
                action={{
                  label: 'Criar Evento',
                  onClick: () => alert('Criar evento'),
                  icon: <Plus className="w-4 h-4" />
                }}
              />
            </Card>

            <Card>
              <EmptyState
                icon={<Bell className="w-16 h-16" />}
                title="Sem notificações"
                description="Você está em dia! Não há notificações pendentes no momento."
              />
            </Card>
          </div>
        </section>

        {/* Grid System */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sistema de Grid</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="col-span-1 bg-blue-500 h-12 rounded flex items-center justify-center text-white text-sm">
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 bg-blue-500 h-12 rounded flex items-center justify-center text-white">
                6 cols
              </div>
              <div className="col-span-6 bg-blue-500 h-12 rounded flex items-center justify-center text-white">
                6 cols
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 bg-blue-500 h-12 rounded flex items-center justify-center text-white">
                4 cols
              </div>
              <div className="col-span-4 bg-blue-500 h-12 rounded flex items-center justify-center text-white">
                4 cols
              </div>
              <div className="col-span-4 bg-blue-500 h-12 rounded flex items-center justify-center text-white">
                4 cols
              </div>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Espaçamento</h2>
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
            {[1, 2, 4, 6, 8, 12, 16].map((space) => (
              <div key={space} className="flex items-center gap-4">
                <span className="text-sm font-mono text-gray-600 w-16">
                  {space * 4}px
                </span>
                <div 
                  className="bg-blue-500 h-8 rounded"
                  style={{ width: `${space * 4}px` }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ícones (Lucide)</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
            {[
              { icon: <Calendar />, name: 'Calendar' },
              { icon: <Bell />, name: 'Bell' },
              { icon: <Settings />, name: 'Settings' },
              { icon: <Plus />, name: 'Plus' },
              { icon: <Search />, name: 'Search' },
              { icon: <Download />, name: 'Download' },
              { icon: <Upload />, name: 'Upload' },
              { icon: <Trash2 />, name: 'Trash' }
            ].map((item) => (
              <div key={item.name} className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-gray-700">
                  {item.icon}
                </div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}