import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  fetchPendingValidations,
  fetchInstitutionalEvents,
  fetchUpcomingMeetings,
  fetchDirectorStats,
  updateValidationStatus,
  type PendingValidation,
  type InstitutionalEvent,
  type ScheduledMeeting,
  type DirectorStats,
} from '../lib/direcao';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  CheckCircle,
  Clock,
  Users,
  Bell,
  AlertCircle,
  TrendingUp,
  FileText,
  Send,
  Plus,
  X,
  ChevronRight,
  Building,
  UserCheck,
  CalendarCheck,
  Megaphone,
  Settings,
  Download,
  Eye,
  Check,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';


export function DirecaoPage() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedValidation, setSelectedValidation] = useState<PendingValidation | null>(null);
  const [validations, setValidations] = useState<PendingValidation[]>([]);
  const [events, setEvents] = useState<InstitutionalEvent[]>([]);
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [stats, setStats] = useState<DirectorStats>({
    eventosInstitucionais: 0,
    validacoesPendentes: 0,
    reunioesProgramadas: 0,
    notificacoesEnviadas: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchPendingValidations(),
      fetchInstitutionalEvents(),
      fetchUpcomingMeetings(),
      fetchDirectorStats(),
    ]).then(([v, e, m, s]) => {
      setValidations(v);
      setEvents(e);
      setMeetings(m);
      setStats(s);
    }).finally(() => setIsLoading(false));
  }, []);

  const eventTypeLabels = {
    pedagogico: 'Pedagógico',
    pais: 'Reunião de Pais',
    institucional: 'Institucional',
    planejamento: 'Planejamento'
  };

  const eventTypeColors = {
    pedagogico: 'bg-blue-500',
    pais: 'bg-green-500',
    institucional: 'bg-purple-500',
    planejamento: 'bg-orange-500'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 dark:bg-amber-950/60 text-yellow-700 dark:text-amber-300',
    low: 'bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200'
  };

  const priorityLabels = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa'
  };

  const handleValidation = (id: string, status: 'approved' | 'rejected') => {
    updateValidationStatus(id, status);
    setValidations(validations.filter(v => v.id !== id));
    setStats(s => ({ ...s, validacoesPendentes: Math.max(0, s.validacoesPendentes - 1) }));
    setSelectedValidation(null);
  };

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const currentWeek = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.getDate();
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0a0f]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1a101a] border-b border-gray-200 dark:border-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="mb-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#221420] rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />Voltar para Home
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel da Direção</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Visão estratégica e gestão institucional</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="px-4 py-2 bg-white dark:bg-[#1a101a] border border-gray-300 dark:border-pink-900/30 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-[#221420] transition-colors flex items-center gap-2"
              >
                <Megaphone className="w-5 h-5" />
                Enviar Notificação
              </button>
              <button
                onClick={() => setIsCreateEventOpen(true)}
                className="px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Criar Evento Global
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-fuchsia-950/70 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-pink-300" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {isLoading ? <span className="animate-pulse">—</span> : stats.eventosInstitucionais}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Eventos Institucionais</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-amber-950/60 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-amber-300" />
              </div>
              <span className="text-xs font-semibold text-orange-600 dark:text-amber-300 bg-orange-100 dark:bg-amber-950/60 px-2 py-1 rounded-full">
                {stats.validacoesPendentes} novos
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {isLoading ? <span className="animate-pulse">—</span> : stats.validacoesPendentes}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Validações Pendentes</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-emerald-950/60 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-emerald-300" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {isLoading ? <span className="animate-pulse">—</span> : stats.reunioesProgramadas}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Reuniões Programadas</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/70 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {isLoading ? <span className="animate-pulse">—</span> : stats.notificacoesEnviadas}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Notificações Enviadas</div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Validações Pendentes */}
            <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20">
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Validações Pendentes</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {validations.length} planos aguardando aprovação
                  </p>
                </div>
                <button className="text-blue-600 dark:text-pink-400 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  Ver todos
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {isLoading ? (
                  <div className="p-6 space-y-3 animate-pulse">
                    {[1, 2].map(i => <div key={i} className="h-14 bg-gray-100 dark:bg-[#221420] rounded-lg" />)}
                  </div>
                ) : validations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">Nenhuma validação pendente</div>
                ) : null}
                {!isLoading && validations.map((validation) => (
                  <motion.div
                    key={validation.id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="p-6 cursor-pointer"
                    onClick={() => setSelectedValidation(validation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-fuchsia-950/70 rounded-full flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-blue-600 dark:text-pink-300" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{validation.teacher}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {validation.subject} - {validation.class}
                            </p>
                          </div>
                        </div>
                        <div className="ml-13 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{validation.date}</span>
                          </div>
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-amber-950/60 text-yellow-700 dark:text-amber-300 rounded-full text-xs font-medium">
                            Aguardando revisão
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleValidation(validation.id, 'approved');
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Aprovar"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleValidation(validation.id, 'rejected');
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Rejeitar"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Eventos Institucionais */}
            <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20">
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Eventos Institucionais</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Próximos eventos globais da escola</p>
                </div>
                <button className="text-blue-600 dark:text-pink-400 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  Ver calendário
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {isLoading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-[#221420] rounded-lg" />)}
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">Nenhum evento institucional próximo</div>
                ) : null}
                {!isLoading && events.map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.01 }}
                    className="border border-gray-200 dark:border-pink-900/20 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-3 h-3 rounded-full ${eventTypeColors[event.type]}`}></span>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{event.participants} pessoas</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[event.priority]}`}>
                        {priorityLabels[event.priority]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Building className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-pink-900/20 text-blue-600 dark:text-pink-400 rounded">
                        {eventTypeLabels[event.type]}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Agenda da Semana */}
            <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20">
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Agenda da Semana</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {currentWeek[0]} - {currentWeek[4]} de {monday.toLocaleDateString('pt-BR', { month: 'long' })}
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {weekDays.map((day, index) => {
                    const isToday = currentWeek[index] === today.getDate() &&
                      monday.getMonth() === today.getMonth();
                    return (
                      <div
                        key={day}
                        className={`text-center p-3 rounded-lg ${
                          isToday
                            ? 'bg-blue-600 dark:bg-pink-600 text-white'
                            : 'bg-gray-50 dark:bg-[#221420] text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        <div className="text-xs mb-1">{day}</div>
                        <div className="text-lg font-bold">{currentWeek[index]}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-3">
                  {meetings.length === 0 && !isLoading ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-xs py-2">Nenhuma reunião esta semana</div>
                  ) : meetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="p-3 bg-gray-50 dark:bg-[#221420] rounded-lg border border-gray-200 dark:border-pink-900/20"
                    >
                      <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                        {meeting.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <Clock className="w-3 h-3" />
                        <span>{meeting.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reuniões Programadas */}
            <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20">
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reuniões Programadas</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Próximas reuniões</p>
              </div>
              <div className="p-6 space-y-3">
                {isLoading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-[#221420] rounded-lg" />)}
                  </div>
                ) : meetings.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">Nenhuma reunião programada</div>
                ) : null}
                {!isLoading && meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="border-l-4 border-purple-500 pl-4 py-2"
                  >
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      {meeting.title}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{meeting.date}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{meeting.participants.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-left flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" />
                  Gerenciar Calendário
                </button>
                <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-left flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar Relatórios
                </button>
                <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-left flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {isCreateEventOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateEventOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white dark:bg-[#1a101a] rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Evento Institucional</h2>
                <button
                  onClick={() => setIsCreateEventOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Título do Evento
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Reunião Pedagógica Geral"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Tipo de Evento
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                      {Object.entries(eventTypeLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Prioridade
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                      <option value="high">Alta</option>
                      <option value="medium">Média</option>
                      <option value="low">Baixa</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Data
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Horário
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Local
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Auditório Principal"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Participantes
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 dark:text-pink-400 rounded" />
                      <span className="text-gray-700 dark:text-gray-200">Todos os professores</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 dark:text-pink-400 rounded" />
                      <span className="text-gray-700 dark:text-gray-200">Coordenação pedagógica</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 dark:text-pink-400 rounded" />
                      <span className="text-gray-700 dark:text-gray-200">Funcionários administrativos</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 dark:text-pink-400 rounded" />
                      <span className="text-gray-700 dark:text-gray-200">Pais e responsáveis</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Detalhes do evento institucional..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 dark:text-pink-400 rounded" />
                  <label className="text-sm text-gray-700 dark:text-gray-200">
                    Enviar notificação automática para todos os participantes
                  </label>
                </div>
              </form>
              <div className="p-6 border-t border-gray-200 dark:border-pink-900/20 flex gap-3">
                <button
                  onClick={() => setIsCreateEventOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setIsCreateEventOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors"
                >
                  Criar Evento
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Send Notification Modal */}
      <AnimatePresence>
        {isNotificationOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-xl shadow-2xl z-50"
            >
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enviar Notificação Institucional</h2>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Destinatários
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                    <option>Todos os usuários</option>
                    <option>Professores</option>
                    <option>Coordenação</option>
                    <option>Funcionários</option>
                    <option>Pais</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Assunto
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Importante: Mudança no calendário escolar"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Digite a mensagem institucional..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 dark:text-pink-400 rounded" defaultChecked />
                  <label className="text-sm text-gray-700 dark:text-gray-200">
                    Enviar também por e-mail
                  </label>
                </div>
              </form>
              <div className="p-6 border-t border-gray-200 dark:border-pink-900/20 flex gap-3">
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Enviar Notificação
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Validation Detail Modal */}
      <AnimatePresence>
        {selectedValidation && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedValidation(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-xl shadow-2xl z-50"
            >
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Validação de Plano de Aula</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{selectedValidation.teacher}</p>
                </div>
                <button
                  onClick={() => setSelectedValidation(null)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Disciplina</div>
                    <div className="text-gray-900 dark:text-white">{selectedValidation.subject}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Turma</div>
                    <div className="text-gray-900 dark:text-white">{selectedValidation.class}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Data</div>
                    <div className="text-gray-900 dark:text-white">{selectedValidation.date}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Status</div>
                    <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-amber-950/60 text-yellow-700 dark:text-amber-300 rounded text-sm">
                      Pendente
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-pink-900/20 pt-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Plano de Aula</div>
                  <div className="bg-gray-50 dark:bg-[#221420] border border-gray-200 dark:border-pink-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-medium">plano_aula_matematica_9a.pdf</span>
                      </div>
                      <button className="text-blue-600 dark:text-pink-400 hover:text-blue-700 flex items-center gap-1 text-sm">
                        <Eye className="w-4 h-4" />
                        Visualizar
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <p className="mb-2"><strong>Tema:</strong> Equações do 2º grau</p>
                      <p className="mb-2"><strong>Objetivos:</strong> Compreender e resolver equações do segundo grau</p>
                      <p><strong>Metodologia:</strong> Aula expositiva com exercícios práticos</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-pink-900/20 flex gap-3">
                <button
                  onClick={() => handleValidation(selectedValidation.id, 'rejected')}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeitar
                </button>
                <button
                  onClick={() => handleValidation(selectedValidation.id, 'approved')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aprovar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


