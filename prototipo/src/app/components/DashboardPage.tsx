import { useState } from 'react';
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
  CheckCircle2,
  AlertCircle,
  BookOpen,
  UserCheck,
  ClipboardList,
  LogOut
} from 'lucide-react';

export function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Agenda', path: '/dashboard/agenda' },
    { icon: <CalendarDays className="w-5 h-5" />, label: 'Eventos', path: '/dashboard/eventos' },
    { icon: <Bell className="w-5 h-5" />, label: 'Notificações', path: '/dashboard/notificacoes', badge: 5 },
    { icon: <Users className="w-5 h-5" />, label: 'Professores', path: '/dashboard/professores' },
    { icon: <Settings className="w-5 h-5" />, label: 'Configurações', path: '/dashboard/configuracoes' },
  ];

  const statsCards = [
    {
      title: 'Eventos Hoje',
      value: '8',
      change: '+2 desde ontem',
      icon: <Calendar className="w-6 h-6" />,
      color: 'blue',
      trend: 'up'
    },
    {
      title: 'Reuniões da Semana',
      value: '12',
      change: '4 pendentes',
      icon: <Users className="w-6 h-6" />,
      color: 'purple',
      trend: 'neutral'
    },
    {
      title: 'Notificações',
      value: '5',
      change: 'Não lidas',
      icon: <Bell className="w-6 h-6" />,
      color: 'orange',
      trend: 'up'
    },
    {
      title: 'Atividades Pendentes',
      value: '3',
      change: 'Requerem atenção',
      icon: <ClipboardList className="w-6 h-6" />,
      color: 'green',
      trend: 'neutral'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Reunião Pedagógica',
      type: 'Reunião',
      time: '09:00 - 10:30',
      location: 'Sala 3',
      date: 'Hoje',
      priority: 'high',
      participants: 12
    },
    {
      id: 2,
      title: 'Avaliação Diagnóstica - 9º Ano',
      type: 'Avaliação',
      time: '14:00 - 15:30',
      location: 'Sala 12',
      date: 'Hoje',
      priority: 'medium',
      participants: 8
    },
    {
      id: 3,
      title: 'Reunião de Pais - 6º Ano',
      type: 'Reunião de Pais',
      time: '18:00 - 20:00',
      location: 'Auditório',
      date: 'Amanhã',
      priority: 'high',
      participants: 35
    },
    {
      id: 4,
      title: 'Planejamento Escolar 2026',
      type: 'Planejamento',
      time: '10:00 - 12:00',
      location: 'Sala de Reuniões',
      date: '10 Mar',
      priority: 'medium',
      participants: 15
    },
    {
      id: 5,
      title: 'Tutoria Individual - Matemática',
      type: 'Tutoria',
      time: '15:00 - 16:00',
      location: 'Sala 5',
      date: '10 Mar',
      priority: 'low',
      participants: 1
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Nova reunião agendada',
      description: 'Reunião Pedagógica marcada para hoje às 09:00',
      time: 'Há 5 minutos',
      type: 'info',
      unread: true
    },
    {
      id: 2,
      title: 'Lembrete de evento',
      description: 'Avaliação Diagnóstica começa em 2 horas',
      time: 'Há 30 minutos',
      type: 'warning',
      unread: true
    },
    {
      id: 3,
      title: 'Atualização de horário',
      description: 'Reunião de Pais alterada para 18:00',
      time: 'Há 1 hora',
      type: 'info',
      unread: false
    },
    {
      id: 4,
      title: 'Confirmação necessária',
      description: 'Confirme presença no Planejamento Escolar',
      time: 'Há 2 horas',
      type: 'alert',
      unread: true
    }
  ];

  // Current date for calendar
  const currentDate = new Date(2026, 2, 7); // March 7, 2026
  const currentMonth = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const eventDays = [7, 8, 10, 15, 18, 22, 25, 28]; // Days with events

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EscolaAgenda</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">MS</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Maria Silva</p>
                <p className="text-sm text-gray-600">Coordenadora</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
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

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Bem-vinda de volta, Maria!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">MS</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => {
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                purple: 'bg-purple-100 text-purple-600',
                orange: 'bg-orange-100 text-orange-600',
                green: 'bg-green-100 text-green-600'
              }[card.color];

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>
                      {card.icon}
                    </div>
                    {card.trend === 'up' && (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.change}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column - Calendar & Events */}
            <div className="lg:col-span-2 space-y-6">
              {/* Calendar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Calendário</h2>
                  <span className="text-sm text-gray-600 capitalize">{currentMonth}</span>
                </div>
                
                <div className="space-y-4">
                  {/* Weekdays */}
                  <div className="grid grid-cols-7 gap-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: firstDay }, (_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const isToday = day === currentDate.getDate();
                      const hasEvent = eventDays.includes(day);
                      return (
                        <button
                          key={day}
                          className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                            isToday
                              ? 'bg-blue-600 text-white shadow-md'
                              : hasEvent
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {day}
                          {hasEvent && !isToday && (
                            <div className="w-1 h-1 bg-blue-600 rounded-full mx-auto mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    <span className="text-gray-600">Hoje</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-50 border-2 border-blue-600 rounded-full" />
                    <span className="text-gray-600">Com eventos</span>
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Próximos Eventos</h2>
                  <Link
                    to="/dashboard/eventos"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    Ver todos
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className={`w-1 h-full rounded-full ${
                        event.priority === 'high'
                          ? 'bg-red-500'
                          : event.priority === 'medium'
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                            {event.date}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{event.participants} participantes</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-white rounded-md border border-gray-200">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right column - Notifications */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Notificações</h2>
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                    3
                  </span>
                </div>

                <div className="space-y-3">
                  {notifications.map((notification, index) => {
                    const iconClass = {
                      info: { bg: 'bg-blue-100', text: 'text-blue-600', icon: <Bell className="w-4 h-4" /> },
                      warning: { bg: 'bg-orange-100', text: 'text-orange-600', icon: <Clock className="w-4 h-4" /> },
                      alert: { bg: 'bg-red-100', text: 'text-red-600', icon: <AlertCircle className="w-4 h-4" /> }
                    }[notification.type];

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          notification.unread
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClass.bg} ${iconClass.text}`}>
                            {iconClass.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {notification.title}
                              </h4>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <Link
                  to="/dashboard/notificacoes"
                  className="block mt-4 pt-4 border-t border-gray-100 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todas as notificações
                </Link>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    <Calendar className="w-5 h-5" />
                    Criar Evento
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                    <UserCheck className="w-5 h-5" />
                    Marcar Presença
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                    <BookOpen className="w-5 h-5" />
                    Ver Relatórios
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