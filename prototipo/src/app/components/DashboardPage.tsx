import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  LayoutDashboard,
  CalendarDays,
  Bell,
  Users,
  Settings,
  Menu,
  X,
  ChevronRight,
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle,
  BookOpen,
  UserCheck,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { supabase, supabaseDefaults } from '../lib/supabase';
import {
  fetchDashboardStats,
  fetchUpcomingEvents,
  fetchDashboardNotifications,
  fetchEventDays,
  type DashboardStats,
  type DashboardNotification,
} from '../lib/dashboard';
import type { AgendaEvent } from '../lib/agenda';

const defaultUserProfile = { nome: 'Usuário', cargo: 'Escola', fotoUrl: '' };

export function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [stats, setStats] = useState<DashboardStats>({ eventosHoje: 0, reunioesSemana: 0, notificacoesNaoLidas: 0, atividadesPendentes: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState<AgendaEvent[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [eventDays, setEventDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const currentDate = useMemo(() => new Date(), []);
  const currentMonth = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Agenda', path: '/dashboard/agenda' },
    { icon: <CalendarDays className="w-5 h-5" />, label: 'Eventos', path: '/dashboard/eventos' },
    { icon: <Bell className="w-5 h-5" />, label: 'Notificacoes', path: '/dashboard/notificacoes', badge: stats.notificacoesNaoLidas || undefined },
    { icon: <Users className="w-5 h-5" />, label: 'Professores', path: '/dashboard/professores' },
    { icon: <Settings className="w-5 h-5" />, label: 'Configuracoes', path: '/dashboard/configuracoes' },
  ];

  const statsCards = [
    { title: 'Eventos Hoje', value: String(stats.eventosHoje), change: 'no calendário', icon: <Calendar className="w-6 h-6" />, color: 'blue', trend: 'up' },
    { title: 'Reunioes da Semana', value: String(stats.reunioesSemana), change: 'esta semana', icon: <Users className="w-6 h-6" />, color: 'purple', trend: 'neutral' },
    { title: 'Notificacoes', value: String(stats.notificacoesNaoLidas), change: 'nao lidas', icon: <Bell className="w-6 h-6" />, color: 'orange', trend: 'up' },
    { title: 'Atividades Pendentes', value: String(stats.atividadesPendentes), change: 'aguardando', icon: <ClipboardList className="w-6 h-6" />, color: 'green', trend: 'neutral' },
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
    const load = async () => {
      setIsLoading(true);
      try {
        const [s, events, notifs, days] = await Promise.all([
          fetchDashboardStats(),
          fetchUpcomingEvents(5),
          fetchDashboardNotifications(4),
          fetchEventDays(currentDate.getFullYear(), currentDate.getMonth()),
        ]);
        setStats(s);
        setUpcomingEvents(events);
        setNotifications(notifs);
        setEventDays(days);
      } catch {
        // mantém estado vazio
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [currentDate]);

  useEffect(() => {
    const loadUser = async () => {
      if (!supabase || !supabaseDefaults.userId) return;
      try {
        const [{ data: u }, { data: p }] = await Promise.all([
          supabase.from('usuarios').select('nome, foto_url').eq('id', supabaseDefaults.userId).maybeSingle(),
          supabase.from('perfis_profissionais').select('cargo').eq('usuario_id', supabaseDefaults.userId).maybeSingle(),
        ]);
        if (u) setUserProfile({ nome: u.nome || defaultUserProfile.nome, cargo: p?.cargo || defaultUserProfile.cargo, fotoUrl: u.foto_url || '' });
      } catch { /* mantém padrão */ }
    };
    void loadUser();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0a0f]">
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
                    <Link to={item.path} className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-pink-900/30 dark:text-pink-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#221420]'}`}>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="bg-white dark:bg-[#1a101a] border-b border-gray-200 dark:border-pink-900/20 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Bem-vinda de volta, {userProfile.nome.split(' ')[0]}!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/dashboard/notificacoes" className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2c1a28] rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                {stats.notificacoesNaoLidas > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
              </Link>
              {renderAvatar('w-10 h-10', 'text-blue-600 dark:text-pink-400 font-semibold')}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => {
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600 dark:bg-fuchsia-950/70 dark:text-pink-300',
                purple: 'bg-purple-100 text-purple-600 dark:bg-purple-950/70 dark:text-purple-300',
                orange: 'bg-orange-100 text-orange-600 dark:bg-amber-950/60 dark:text-amber-300',
                green: 'bg-green-100 text-green-600 dark:bg-emerald-950/60 dark:text-emerald-300',
              }[card.color];
              return (
                <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }} className="bg-white dark:bg-[#1a101a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-pink-900/10 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>{card.icon}</div>
                    {card.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500 dark:text-emerald-400" />}
                  </div>
                  <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">{card.title}</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {isLoading ? <span className="inline-block w-8 h-8 bg-gray-200 dark:bg-[#2c1a28] rounded animate-pulse" /> : card.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.change}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Calendário */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white dark:bg-[#1a101a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-pink-900/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Calendario</h2>
                  <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{currentMonth}</span>
                </div>
                <div className="overflow-x-auto pb-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2 min-w-[420px]">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((d) => (
                        <div key={d} className="text-center text-xs font-medium text-gray-600 dark:text-gray-300 py-2">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2 min-w-[420px]">
                      {Array.from({ length: firstDay }, (_, i) => <div key={`e-${i}`} className="aspect-square" />)}
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const isToday = day === currentDate.getDate();
                        const hasEvent = eventDays.includes(day);
                        return (
                          <button key={day} className={`aspect-square rounded-lg text-sm font-medium transition-all ${isToday ? 'bg-blue-600 dark:bg-pink-600 text-white shadow-md' : hasEvent ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-pink-900/20 dark:text-pink-400 dark:hover:bg-pink-900/30' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#221420]'}`}>
                            {day}
                            {hasEvent && !isToday && <div className="w-1 h-1 bg-blue-600 dark:bg-pink-400 rounded-full mx-auto mt-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-pink-900/10 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 dark:bg-pink-600 rounded-full" /><span className="text-gray-600 dark:text-gray-300">Hoje</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-50 dark:bg-pink-900/20 border-2 border-blue-600 dark:border-pink-400 rounded-full" /><span className="text-gray-600 dark:text-gray-300">Com eventos</span></div>
                </div>
              </motion.div>

              {/* Próximos eventos */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-white dark:bg-[#1a101a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-pink-900/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Proximos Eventos</h2>
                  <Link to="/dashboard/agenda" className="text-sm text-blue-600 dark:text-pink-400 hover:text-blue-700 dark:hover:text-pink-300 font-medium flex items-center gap-1">
                    Ver todos <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 dark:bg-[#221420] rounded-lg animate-pulse" />)}
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>Nenhum evento próximo</p>
                    <Link to="/dashboard/agenda" className="mt-2 inline-block text-sm text-blue-600 dark:text-pink-400 hover:underline">Criar evento</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-[#221420] rounded-lg hover:bg-gray-100 dark:hover:bg-[#2c1a28] transition-colors cursor-pointer">
                        <div className={`w-1 self-stretch rounded-full ${event.category === 'reuniao' ? 'bg-red-500' : event.category === 'avaliacao' ? 'bg-orange-500' : 'bg-green-500'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{event.title}</h3>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatEventDate(event.date)}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{event.startTime} - {event.endTime}</span></div>
                            <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>{event.location}</span></div>
                            {event.participants.length > 0 && <div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>{event.participants.length} participantes</span></div>}
                          </div>
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-white dark:bg-[#2c1a28] rounded-md border border-gray-200 dark:border-pink-900/30 dark:text-gray-300 capitalize">{event.category}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            <div className="space-y-6">
              {/* Notificações */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="bg-white dark:bg-[#1a101a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-pink-900/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notificacoes</h2>
                  {stats.notificacoesNaoLidas > 0 && (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">{stats.notificacoesNaoLidas}</span>
                  )}
                </div>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 dark:bg-[#221420] rounded-lg animate-pulse" />)}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Nenhuma notificação</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((n, index) => {
                      const iconClass = {
                        info: { bg: 'bg-blue-100 dark:bg-pink-900/30', text: 'text-blue-600 dark:text-pink-400', icon: <Bell className="w-4 h-4" /> },
                        warning: { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', icon: <Clock className="w-4 h-4" /> },
                        alert: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', icon: <AlertCircle className="w-4 h-4" /> },
                      }[n.type];
                      return (
                        <motion.div key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }} className={`p-4 rounded-lg border cursor-pointer transition-all ${n.unread ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-pink-900/20 dark:border-pink-700/30 dark:hover:bg-pink-900/30' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-[#221420] dark:border-pink-900/20 dark:hover:bg-[#2c1a28]'}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClass.bg} ${iconClass.text}`}>{iconClass.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{n.title}</h4>
                                {n.unread && <div className="w-2 h-2 bg-blue-600 dark:bg-pink-400 rounded-full mt-1" />}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{n.description}</p>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{n.time}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
                <Link to="/dashboard/notificacoes" className="block mt-4 pt-4 border-t border-gray-100 dark:border-pink-900/10 text-center text-sm text-blue-600 dark:text-pink-400 hover:text-blue-700 dark:hover:text-pink-300 font-medium">
                  Ver todas as notificacoes
                </Link>
              </motion.div>

              {/* Ações rápidas */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="bg-white dark:bg-[#1a101a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-pink-900/10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Acoes Rapidas</h2>
                <div className="space-y-2">
                  <Link to="/dashboard/agenda" className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium dark:bg-pink-900/20 dark:text-pink-400 dark:hover:bg-pink-900/30">
                    <Calendar className="w-5 h-5" />Ir para Agenda
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium dark:bg-[#221420] dark:text-gray-200 dark:hover:bg-[#2c1a28]">
                    <UserCheck className="w-5 h-5" />Marcar Presenca
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium dark:bg-[#221420] dark:text-gray-200 dark:hover:bg-[#2c1a28]">
                    <BookOpen className="w-5 h-5" />Ver Relatorios
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
