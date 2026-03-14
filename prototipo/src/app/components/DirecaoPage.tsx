import { useState } from 'react';
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
  XCircle
} from 'lucide-react';

interface PendingValidation {
  id: string;
  teacher: string;
  subject: string;
  class: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface InstitutionalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'pedagogico' | 'pais' | 'institucional' | 'planejamento';
  participants: number;
  location: string;
  priority: 'high' | 'medium' | 'low';
}

interface ScheduledMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
  location: string;
}

const mockValidations: PendingValidation[] = [
  {
    id: '1',
    teacher: 'Prof. João Silva',
    subject: 'Matemática',
    class: '9º A',
    date: '10/03/2026',
    status: 'pending'
  },
  {
    id: '2',
    teacher: 'Profa. Maria Santos',
    subject: 'Português',
    class: '8º B',
    date: '10/03/2026',
    status: 'pending'
  },
  {
    id: '3',
    teacher: 'Prof. Carlos Oliveira',
    subject: 'História',
    class: '7º C',
    date: '11/03/2026',
    status: 'pending'
  }
];

const mockEvents: InstitutionalEvent[] = [
  {
    id: '1',
    title: 'Reunião Pedagógica Geral',
    date: '10/03/2026',
    time: '09:00',
    type: 'pedagogico',
    participants: 25,
    location: 'Auditório Principal',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Reunião de Pais - 1º Bimestre',
    date: '12/03/2026',
    time: '18:00',
    type: 'pais',
    participants: 120,
    location: 'Pátio Coberto',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Planejamento 2º Semestre',
    date: '15/03/2026',
    time: '14:00',
    type: 'planejamento',
    participants: 15,
    location: 'Sala de Reuniões',
    priority: 'medium'
  }
];

const mockMeetings: ScheduledMeeting[] = [
  {
    id: '1',
    title: 'Reunião com Coordenação Pedagógica',
    date: '09/03/2026',
    time: '10:00',
    participants: ['Coord. Ana', 'Coord. Pedro'],
    location: 'Sala da Direção'
  },
  {
    id: '2',
    title: 'Apresentação Resultados 1º Bimestre',
    date: '11/03/2026',
    time: '15:00',
    participants: ['Equipe Pedagógica', 'Professores'],
    location: 'Sala de Reuniões'
  }
];

export function DirecaoPage() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedValidation, setSelectedValidation] = useState<PendingValidation | null>(null);
  const [validations, setValidations] = useState(mockValidations);

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
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-700'
  };

  const priorityLabels = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa'
  };

  const handleValidation = (id: string, status: 'approved' | 'rejected') => {
    setValidations(validations.map(v => 
      v.id === id ? { ...v, status } : v
    ));
    setSelectedValidation(null);
  };

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  const currentWeek = [9, 10, 11, 12, 13]; // March 9-13, 2026

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel da Direção</h1>
              <p className="text-gray-600 mt-1">Visão estratégica e gestão institucional</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Megaphone className="w-5 h-5" />
                Enviar Notificação
              </button>
              <button
                onClick={() => setIsCreateEventOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">32</div>
            <div className="text-sm text-gray-600">Eventos Institucionais</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                {validations.filter(v => v.status === 'pending').length} novos
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {validations.filter(v => v.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Validações Pendentes</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">18</div>
            <div className="text-sm text-gray-600">Reuniões Programadas</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">245</div>
            <div className="text-sm text-gray-600">Notificações Enviadas</div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Validações Pendentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Validações Pendentes</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {validations.filter(v => v.status === 'pending').length} planos aguardando aprovação
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  Ver todos
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {validations.filter(v => v.status === 'pending').map((validation) => (
                  <motion.div
                    key={validation.id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="p-6 cursor-pointer"
                    onClick={() => setSelectedValidation(validation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{validation.teacher}</h3>
                            <p className="text-sm text-gray-600">
                              {validation.subject} - {validation.class}
                            </p>
                          </div>
                        </div>
                        <div className="ml-13 flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{validation.date}</span>
                          </div>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Eventos Institucionais</h2>
                  <p className="text-sm text-gray-600 mt-1">Próximos eventos globais da escola</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  Ver calendário
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {mockEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.01 }}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-3 h-3 rounded-full ${eventTypeColors[event.type]}`}></span>
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
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
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Agenda da Semana</h2>
                <p className="text-sm text-gray-600 mt-1">9 - 13 de março</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {weekDays.map((day, index) => {
                    const isToday = currentWeek[index] === 9;
                    return (
                      <div
                        key={day}
                        className={`text-center p-3 rounded-lg ${
                          isToday
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="text-xs mb-1">{day}</div>
                        <div className="text-lg font-bold">{currentWeek[index]}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-3">
                  {mockMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="font-medium text-gray-900 text-sm mb-1">
                        {meeting.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{meeting.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reuniões Programadas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Reuniões Programadas</h2>
                <p className="text-sm text-gray-600 mt-1">Próximas reuniões</p>
              </div>
              <div className="p-6 space-y-3">
                {mockMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="border-l-4 border-purple-500 pl-4 py-2"
                  >
                    <div className="font-semibold text-gray-900 mb-1">
                      {meeting.title}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{meeting.date}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
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
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Criar Evento Institucional</h2>
                <button
                  onClick={() => setIsCreateEventOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Evento
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Reunião Pedagógica Geral"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Evento
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                      {Object.entries(eventTypeLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                      <option value="high">Alta</option>
                      <option value="medium">Média</option>
                      <option value="low">Baixa</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Local
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Auditório Principal"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participantes
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-gray-700">Todos os professores</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-gray-700">Coordenação pedagógica</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-gray-700">Funcionários administrativos</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-gray-700">Pais e responsáveis</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Detalhes do evento institucional..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <label className="text-sm text-gray-700">
                    Enviar notificação automática para todos os participantes
                  </label>
                </div>
              </form>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setIsCreateEventOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setIsCreateEventOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Enviar Notificação Institucional</h2>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinatários
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                    <option>Todos os usuários</option>
                    <option>Professores</option>
                    <option>Coordenação</option>
                    <option>Funcionários</option>
                    <option>Pais</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Importante: Mudança no calendário escolar"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Digite a mensagem institucional..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                  <label className="text-sm text-gray-700">
                    Enviar também por e-mail
                  </label>
                </div>
              </form>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Validação de Plano de Aula</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedValidation.teacher}</p>
                </div>
                <button
                  onClick={() => setSelectedValidation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Disciplina</div>
                    <div className="text-gray-900">{selectedValidation.subject}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Turma</div>
                    <div className="text-gray-900">{selectedValidation.class}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Data</div>
                    <div className="text-gray-900">{selectedValidation.date}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Status</div>
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
                      Pendente
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Plano de Aula</div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 font-medium">plano_aula_matematica_9a.pdf</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
                        <Eye className="w-4 h-4" />
                        Visualizar
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="mb-2"><strong>Tema:</strong> Equações do 2º grau</p>
                      <p className="mb-2"><strong>Objetivos:</strong> Compreender e resolver equações do segundo grau</p>
                      <p><strong>Metodologia:</strong> Aula expositiva com exercícios práticos</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3">
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
