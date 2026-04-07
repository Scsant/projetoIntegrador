import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Calendar,
  CalendarDays,
  Bell,
  Users,
  Settings,
  Menu,
  X,
  ChevronRight,
  Clock,
  TrendingUp,
  AlertCircle,
  BookOpen,
  ClipboardList,
  LogOut,
  GraduationCap,
  Building2,
  UserCheck,
  Megaphone,
  Pin,
  Plus,
  Send,
  PartyPopper,
  CalendarCheck,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { supabase, supabaseDefaults } from '../lib/supabase';
import {
  fetchDashboardStats,
  fetchUpcomingEvents,
  fetchEventDays,
  type DashboardStats,
} from '../lib/dashboard';
import {
  fetchTeamStats,
  fetchSpecialDateStats,
  fetchAvisos,
  createAviso,
  type TeamStats,
  type SpecialDateStats,
  type Aviso,
} from '../lib/home';
import type { AgendaEvent } from '../lib/agenda';

const defaultUserProfile = { nome: 'Usuário', cargo: 'Escola', fotoUrl: '' };

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [stats, setStats] = useState<DashboardStats>({
    eventosHoje: 0,
    reunioesSemana: 0,
    notificacoesNaoLidas: 0,
    atividadesPendentes: 0,
  });
  const [teamStats, setTeamStats] = useState<TeamStats>({
    professores: 0,
    coordenadores: 0,
    direcao: 0,
    total: 0,
  });
  const [specialDates, setSpecialDates] = useState<SpecialDateStats>({
    totalAno: 0,
    proximaData: null,
    proximas: [],
  });
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<AgendaEvent[]>([]);
  const [eventDays, setEventDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewAvisoOpen, setIsNewAvisoOpen] = useState(false);
  const [newAvisoTitulo, setNewAvisoTitulo] = useState('');
  const [newAvisoConteudo, setNewAvisoConteudo] = useState('');
  const [newAvisoFixado, setNewAvisoFixado] = useState(false);
  const [isSavingAviso, setIsSavingAviso] = useState(false);

  const location = useLocation();
  const currentDate = useMemo(() => new Date(), []);

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/dashboard' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Agenda', path: '/dashboard/agenda' },
    { icon: <CalendarDays className="w-5 h-5" />, label: 'Eventos', path: '/dashboard/eventos' },
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'Notificações',
      path: '/dashboard/notificacoes',
      badge: stats.notificacoesNaoLidas || undefined,
    },
    { icon: <Users className="w-5 h-5" />, label: 'Professores', path: '/dashboard/professores' },
    { icon: <Settings className="w-5 h-5" />, label: 'Configurações', path: '/dashboard/configuracoes' },
  ];

  const userInitials = useMemo(() => {
    const parts = userProfile.nome.trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || 'EA';
  }, [userProfile.nome]);

  const { firstDay, daysInMonth } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return {
      firstDay: new Date(year, month, 1).getDay(),
      daysInMonth: new Date(year, month + 1, 0).getDate(),
    };
  }, [currentDate]);

  useEffect(() => {
    Promise.all([
      fetchDashboardStats(),
      fetchTeamStats(),
      fetchSpecialDateStats(),
      fetchAvisos(),
      fetchUpcomingEvents(4),
      fetchEventDays(currentDate.getFullYear(), currentDate.getMonth()),
    ]).then(([s, team, dates, av, events, days]) => {
      setStats(s);
      setTeamStats(team);
      setSpecialDates(dates);
      setAvisos(av);
      setUpcomingEvents(events);
      setEventDays(days);
    }).finally(() => setIsLoading(false));
  }, [currentDate]);

  useEffect(() => {
    const loadUser = async () => {
      if (!supabase || !supabaseDefaults.userId) return;
      try {
        const [{ data: u }, { data: p }] = await Promise.all([
          supabase.from('usuarios').select('nome, foto_url').eq('id', supabaseDefaults.userId).maybeSingle(),
          supabase.from('perfis_profissionais').select('cargo').eq('usuario_id', supabaseDefaults.userId).maybeSingle(),
        ]);
        if (u) {
          setUserProfile({
            nome: u.nome || defaultUserProfile.nome,
            cargo: p?.cargo || defaultUserProfile.cargo,
            fotoUrl: u.foto_url || '',
          });
        }
      } catch { /* mantém padrão */ }
    };
    void loadUser();
  }, []);

  const handleCreateAviso = async () => {
    if (!newAvisoTitulo.trim() || !newAvisoConteudo.trim()) return;
    setIsSavingAviso(true);
    await createAviso(newAvisoTitulo, newAvisoConteudo, userProfile.nome, newAvisoFixado);
    const updated = await fetchAvisos();
    setAvisos(updated);
    setNewAvisoTitulo('');
    setNewAvisoConteudo('');
    setNewAvisoFixado(false);
    setIsNewAvisoOpen(false);
    setIsSavingAviso(false);
  };

  const renderAvatar = (sizeClass: string, textClass: string) => (
    <div className={`${sizeClass} bg-blue-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center overflow-hidden`}>
      {userProfile.fotoUrl
        ? <img src={userProfile.fotoUrl} alt={userProfile.nome} className="h-full w-full object-cover" />
        : <span className={textClass}>{userInitials}</span>}
    </div>
  );

  const formatEventDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã';
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const quickStats = [
    {
      title: 'Eventos Hoje',
      value: stats.eventosHoje,
      icon: <CalendarCheck className="w-6 h-6" />,
      colorLight: 'bg-blue-100 text-blue-600',
      colorDark: 'dark:bg-fuchsia-950/70 dark:text-pink-300',
      link: '/dashboard/agenda',
    },
    {
      title: 'Reuniões na Semana',
      value: stats.reunioesSemana,
      icon: <Users className="w-6 h-6" />,
      colorLight: 'bg-purple-100 text-purple-600',
      colorDark: 'dark:bg-purple-950/70 dark:text-purple-300',
      link: '/dashboard/agenda',
    },
    {
      title: 'Notificações',
      value: stats.notificacoesNaoLidas,
      icon: <Bell className="w-6 h-6" />,
      colorLight: 'bg-orange-100 text-orange-600',
      colorDark: 'dark:bg-amber-950/60 dark:text-amber-300',
      link: '/dashboard/notificacoes',
    },
    {
      title: 'Pendências',
      value: stats.atividadesPendentes,
      icon: <ClipboardList className="w-6 h-6" />,
      colorLight: 'bg-green-100 text-green-600',
      colorDark: 'dark:bg-emerald-950/60 dark:text-emerald-300',
      link: '/dashboard/agenda',
    },
  ];

  const teamCards = [
    {
      label: 'Professores',
      value: teamStats.professores,
      icon: <GraduationCap className="w-7 h-7" />,
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-pink-700 dark:to-pink-900',
      desc: 'ativos na escola',
    },
    {
      label: 'Coordenadores',
      value: teamStats.coordenadores,
      icon: <UserCheck className="w-7 h-7" />,
      bg: 'bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-800 dark:to-purple-950',
      desc: 'pedagógicos',
    },
    {
      label: 'Direção',
      value: teamStats.direcao,
      icon: <Building2 className="w-7 h-7" />,
      bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-800 dark:to-emerald-950',
      desc: 'diretores e vice-diretores',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0a0f]">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-[#1a101a] border-r border-gray-200 dark:border-pink-900/20 z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-pink-900/20">
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-pink-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">EscolaAgenda</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 border-b border-gray-200 dark:border-pink-900/20">
            <div className="flex items-center gap-3">
              {renderAvatar('w-12 h-12', 'text-blue-600 dark:text-pink-400 font-semibold text-lg')}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{userProfile.nome}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{userProfile.cargo}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-pink-900/30 dark:text-pink-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#221420]'}`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">{item.badge}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-pink-900/20">
            <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#221420] rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </Link>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white dark:bg-[#1a101a] border-b border-gray-200 dark:border-pink-900/20 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Home</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                to="/dashboard/notificacoes"
                className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2c1a28] rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6" />
                {stats.notificacoesNaoLidas > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
              {renderAvatar('w-10 h-10', 'text-blue-600 dark:text-pink-400 font-semibold')}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-pink-800 dark:to-pink-950 rounded-2xl p-6 mb-8 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 opacity-80" />
                  <span className="text-blue-100 dark:text-pink-200 text-sm font-medium">
                    {getGreeting()}!
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {userProfile.nome.split(' ')[0]}
                </h2>
                <p className="text-blue-100 dark:text-pink-200 text-sm">
                  {stats.eventosHoje > 0
                    ? `Você tem ${stats.eventosHoje} evento${stats.eventosHoje > 1 ? 's' : ''} hoje.`
                    : 'Nenhum evento agendado para hoje.'}
                  {stats.atividadesPendentes > 0 &&
                    ` ${stats.atividadesPendentes} atividade${stats.atividadesPendentes > 1 ? 's' : ''} pendente${stats.atividadesPendentes > 1 ? 's' : ''}.`}
                </p>
              </div>
              <div className="hidden sm:block opacity-20">
                <Calendar className="w-24 h-24" />
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.07 }}
              >
                <Link
                  to={card.link}
                  className="block bg-white dark:bg-[#1a101a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-pink-900/10 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${card.colorLight} ${card.colorDark}`}>
                    {card.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                    {isLoading ? <span className="inline-block w-6 h-6 bg-gray-200 dark:bg-[#2c1a28] rounded animate-pulse" /> : card.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{card.title}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {teamCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
                className={`${card.bg} rounded-2xl p-6 text-white shadow-md`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    {card.icon}
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-4xl font-bold mb-1">
                  {isLoading ? <span className="inline-block w-10 h-10 bg-white/20 rounded animate-pulse" /> : card.value}
                </p>
                <p className="text-lg font-semibold opacity-90">{card.label}</p>
                <p className="text-sm opacity-70">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Mural de Avisos */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="bg-white dark:bg-[#1a101a] rounded-2xl shadow-sm border border-gray-100 dark:border-pink-900/10"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-pink-900/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-blue-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Mural de Avisos</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Comunicados para toda equipe</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsNewAvisoOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Publicar
                  </button>
                </div>

                {/* New post form */}
                <AnimatePresence>
                  {isNewAvisoOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-blue-50 dark:bg-pink-900/10 border-b border-blue-100 dark:border-pink-900/20 space-y-3">
                        <input
                          type="text"
                          placeholder="Título do aviso..."
                          value={newAvisoTitulo}
                          onChange={(e) => setNewAvisoTitulo(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white dark:bg-[#1a101a] border border-gray-200 dark:border-pink-900/30 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-pink-500"
                        />
                        <textarea
                          placeholder="Escreva o aviso aqui..."
                          value={newAvisoConteudo}
                          onChange={(e) => setNewAvisoConteudo(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2.5 bg-white dark:bg-[#1a101a] border border-gray-200 dark:border-pink-900/30 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-pink-500 resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newAvisoFixado}
                              onChange={(e) => setNewAvisoFixado(e.target.checked)}
                              className="w-4 h-4 accent-blue-600"
                            />
                            <Pin className="w-4 h-4" />
                            Fixar aviso
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setIsNewAvisoOpen(false)}
                              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#221420] rounded-lg transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleCreateAviso}
                              disabled={isSavingAviso || !newAvisoTitulo.trim() || !newAvisoConteudo.trim()}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 disabled:opacity-50 transition-colors text-sm font-medium"
                            >
                              <Send className="w-4 h-4" />
                              {isSavingAviso ? 'Publicando...' : 'Publicar'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Posts list */}
                <div className="divide-y divide-gray-50 dark:divide-pink-900/10">
                  {isLoading ? (
                    <div className="p-6 space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-[#221420] rounded w-3/4" />
                          <div className="h-3 bg-gray-100 dark:bg-[#2c1a28] rounded w-full" />
                          <div className="h-3 bg-gray-100 dark:bg-[#2c1a28] rounded w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : avisos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-[#221420] rounded-full flex items-center justify-center mb-4">
                        <Megaphone className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">Nenhum aviso publicado</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                        Seja o primeiro a compartilhar algo com a equipe!
                      </p>
                      <button
                        onClick={() => setIsNewAvisoOpen(true)}
                        className="text-sm text-blue-600 dark:text-pink-400 hover:underline font-medium"
                      >
                        Publicar primeiro aviso
                      </button>
                      <p className="text-xs text-gray-400 dark:text-gray-600 mt-3">
                        Dica: crie a tabela <code className="bg-gray-100 dark:bg-[#221420] px-1 rounded">avisos</code> no Supabase para ativar este recurso.
                      </p>
                    </div>
                  ) : (
                    avisos.map((aviso, i) => (
                      <motion.div
                        key={aviso.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-6 hover:bg-gray-50 dark:hover:bg-[#221420] transition-colors ${aviso.fixado ? 'bg-blue-50/50 dark:bg-pink-900/10' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-blue-600 dark:text-pink-400">
                              {aviso.autor[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                  {aviso.titulo}
                                </h3>
                                {aviso.fixado && (
                                  <Pin className="w-3.5 h-3.5 text-blue-500 dark:text-pink-400 flex-shrink-0" />
                                )}
                              </div>
                              <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                {aviso.timeAgo}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                              {aviso.conteudo}
                            </p>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              por {aviso.autor}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Datas Especiais */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white dark:bg-[#1a101a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-pink-900/10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-amber-950/60 rounded-xl flex items-center justify-center">
                    <PartyPopper className="w-5 h-5 text-orange-500 dark:text-amber-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Datas Especiais</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isLoading ? '...' : `${specialDates.totalAno} no ano de ${currentDate.getFullYear()}`}
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-2 animate-pulse">
                    {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-100 dark:bg-[#221420] rounded-lg" />)}
                  </div>
                ) : specialDates.proximas.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
                    <CalendarCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Nenhuma data especial registrada
                    <br />
                    <span className="text-xs">Adicione no <code className="bg-gray-100 dark:bg-[#221420] px-1 rounded">calendario_excecoes</code></span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {specialDates.proximas.map((d, i) => (
                      <div
                        key={d.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${i === 0 ? 'bg-orange-50 dark:bg-amber-950/30' : 'hover:bg-gray-50 dark:hover:bg-[#221420]'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${i === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-[#221420] text-gray-600 dark:text-gray-300'}`}>
                          {new Date(d.isoDate).getDate()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{d.title}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{d.date}</p>
                        </div>
                        {i === 0 && (
                          <span className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-amber-950/60 text-orange-600 dark:text-amber-300 rounded-full font-medium whitespace-nowrap">
                            Próxima
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Mini Calendar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="bg-white dark:bg-[#1a101a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-pink-900/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                    {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </h2>
                  <Link
                    to="/dashboard/agenda"
                    className="text-xs text-blue-600 dark:text-pink-400 hover:underline font-medium"
                  >
                    Ver agenda
                  </Link>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }, (_, i) => <div key={`e-${i}`} className="aspect-square" />)}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isToday = day === currentDate.getDate();
                    const hasEvent = eventDays.includes(day);
                    return (
                      <button
                        key={day}
                        className={`aspect-square rounded-md text-xs font-medium transition-all relative ${isToday ? 'bg-blue-600 dark:bg-pink-600 text-white shadow-sm' : hasEvent ? 'bg-blue-50 text-blue-600 dark:bg-pink-900/20 dark:text-pink-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#221420]'}`}
                      >
                        {day}
                        {hasEvent && !isToday && (
                          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 dark:bg-pink-400 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-pink-900/10 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-blue-600 dark:bg-pink-600 rounded-sm" />Hoje</div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-blue-50 dark:bg-pink-900/20 border border-blue-400 dark:border-pink-400 rounded-sm" />Eventos</div>
                </div>
              </motion.div>

              {/* Próximos Eventos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-white dark:bg-[#1a101a] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-pink-900/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">Próximos Eventos</h2>
                  <Link
                    to="/dashboard/agenda"
                    className="text-xs text-blue-600 dark:text-pink-400 font-medium hover:underline flex items-center gap-0.5"
                  >
                    Ver todos <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                {isLoading ? (
                  <div className="space-y-2 animate-pulse">
                    {[1, 2].map((i) => <div key={i} className="h-14 bg-gray-100 dark:bg-[#221420] rounded-lg" />)}
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 dark:text-gray-500 text-sm">
                    Nenhum evento próximo
                  </div>
                ) : (
                  <div className="space-y-2">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#221420] transition-colors">
                        <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${event.category === 'reuniao' ? 'bg-red-400' : event.category === 'avaliacao' ? 'bg-orange-400' : 'bg-green-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{event.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{formatEventDate(event.date)}</span>
                            {event.location && (
                              <>
                                <MapPin className="w-3 h-3 ml-1" />
                                <span className="truncate">{event.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
