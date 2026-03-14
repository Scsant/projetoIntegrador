import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  FileText,
  X,
  Filter,
  Check,
  Trash2,
  Archive,
  ChevronRight
} from 'lucide-react';

type NotificationType = 'reuniao' | 'evento' | 'validacao' | 'atualizacao';
type NotificationPriority = 'high' | 'medium' | 'low';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  date: string;
  time: string;
  isRead: boolean;
  priority: NotificationPriority;
  actionLabel?: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reuniao',
    title: 'Reunião Pedagógica em 30 minutos',
    description: 'Lembrete: Reunião com a coordenação pedagógica às 09:30 no Auditório Principal',
    date: '2026-03-07',
    time: '09:00',
    isRead: false,
    priority: 'high',
    actionLabel: 'Ver detalhes',
    actionUrl: '/dashboard/agenda'
  },
  {
    id: '2',
    type: 'validacao',
    title: 'Nova validação pendente',
    description: 'Prof. João Silva enviou plano de aula de Matemática - 9º A para aprovação',
    date: '2026-03-07',
    time: '08:45',
    isRead: false,
    priority: 'high',
    actionLabel: 'Validar agora',
    actionUrl: '/dashboard/direcao'
  },
  {
    id: '3',
    type: 'evento',
    title: 'Evento próximo: Reunião de Pais',
    description: 'Reunião bimestral com pais do 6º ano acontece amanhã às 18:00',
    date: '2026-03-07',
    time: '08:30',
    isRead: false,
    priority: 'medium',
    actionLabel: 'Ver evento',
    actionUrl: '/dashboard/agenda'
  },
  {
    id: '4',
    type: 'atualizacao',
    title: 'Agenda atualizada',
    description: 'A coordenação pedagógica atualizou o calendário escolar do mês de março',
    date: '2026-03-07',
    time: '07:15',
    isRead: true,
    priority: 'low',
    actionLabel: 'Ver calendário',
    actionUrl: '/dashboard/agenda'
  },
  {
    id: '5',
    type: 'reuniao',
    title: 'Reunião reagendada',
    description: 'Conselho de Classe 9º A foi reagendado para 10/03 às 14:00',
    date: '2026-03-06',
    time: '16:20',
    isRead: true,
    priority: 'medium',
    actionLabel: 'Ver detalhes',
    actionUrl: '/dashboard/agenda'
  },
  {
    id: '6',
    type: 'validacao',
    title: 'Plano de aula aprovado',
    description: 'Seu plano de aula para Matemática - 8º B foi aprovado pela coordenação',
    date: '2026-03-06',
    time: '14:30',
    isRead: true,
    priority: 'low',
    actionLabel: 'Ver plano',
    actionUrl: '/dashboard/professor'
  },
  {
    id: '7',
    type: 'evento',
    title: 'Novo evento institucional criado',
    description: 'Planejamento Estratégico 2º Semestre foi adicionado ao calendário',
    date: '2026-03-06',
    time: '11:00',
    isRead: true,
    priority: 'medium',
    actionLabel: 'Ver evento',
    actionUrl: '/dashboard/agenda'
  },
  {
    id: '8',
    type: 'atualizacao',
    title: 'Horário de aula alterado',
    description: 'A aula de Matemática do 7º C foi alterada para quinta-feira às 08:20',
    date: '2026-03-05',
    time: '18:45',
    isRead: true,
    priority: 'high',
    actionLabel: 'Ver agenda',
    actionUrl: '/dashboard/professor'
  }
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const notificationIcons = {
    reuniao: <Users className="w-5 h-5" />,
    evento: <Calendar className="w-5 h-5" />,
    validacao: <FileText className="w-5 h-5" />,
    atualizacao: <CheckCircle className="w-5 h-5" />
  };

  const notificationColors = {
    reuniao: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', dot: 'bg-blue-500' },
    evento: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', dot: 'bg-green-500' },
    validacao: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600', dot: 'bg-orange-500' },
    atualizacao: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', dot: 'bg-purple-500' }
  };

  const notificationLabels = {
    reuniao: 'Lembrete de Reunião',
    evento: 'Evento Próximo',
    validacao: 'Validação Pendente',
    atualizacao: 'Atualização de Agenda'
  };

  const priorityColors = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-gray-300'
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    if (filter !== 'all') {
      filtered = filtered.filter(n => n.type === filter);
    }
    
    if (showUnreadOnly) {
      filtered = filtered.filter(n => !n.isRead);
    }
    
    return filtered;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = getFilteredNotifications();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date('2026-03-07');
    const yesterday = new Date('2026-03-06');
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="w-8 h-8" />
                Notificações
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? (
                  <span>
                    <span className="font-semibold text-blue-600">{unreadCount}</span> notificação{unreadCount > 1 ? 'ões' : ''} não lida{unreadCount > 1 ? 's' : ''}
                  </span>
                ) : (
                  'Todas as notificações foram lidas'
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                disabled={unreadCount === 0}
              >
                <CheckCircle className="w-5 h-5" />
                Marcar todas como lidas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(notificationLabels) as NotificationType[]).map((type) => {
            const count = notifications.filter(n => n.type === type && !n.isRead).length;
            return (
              <motion.div
                key={type}
                whileHover={{ y: -2 }}
                onClick={() => setFilter(filter === type ? 'all' : type)}
                className={`bg-white rounded-lg p-4 shadow-sm border-2 cursor-pointer transition-all ${
                  filter === type ? notificationColors[type].border : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${notificationColors[type].bg} rounded-lg flex items-center justify-center ${notificationColors[type].icon}`}>
                    {notificationIcons[type]}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-xs text-gray-600">{notificationLabels[type]}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todas
                </button>
                {(Object.entries(notificationLabels) as [NotificationType, string][]).map(([type, label]) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Apenas não lidas</span>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma notificação</h3>
            <p className="text-gray-600">
              {showUnreadOnly
                ? 'Você não tem notificações não lidas'
                : 'Não há notificações no momento'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`bg-white rounded-lg shadow-sm border-l-4 ${priorityColors[notification.priority]} overflow-hidden ${
                    !notification.isRead ? 'border-r-4 border-r-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 ${notificationColors[notification.type].bg} rounded-lg flex items-center justify-center ${notificationColors[notification.type].icon}`}>
                        {notificationIcons[notification.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {!notification.isRead && (
                                <span className={`w-2 h-2 rounded-full ${notificationColors[notification.type].dot}`}></span>
                              )}
                              <h3 className="text-lg font-semibold text-gray-900">
                                {notification.title}
                              </h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                              {notification.description}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${notificationColors[notification.type].bg} ${notificationColors[notification.type].icon} font-medium whitespace-nowrap`}>
                            {notificationLabels[notification.type]}
                          </span>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(notification.date)}</span>
                            <span>às {notification.time}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {notification.actionLabel && (
                            <button
                              onClick={() => setSelectedNotification(notification)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                              {notification.actionLabel}
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Marcar como lida
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-xl shadow-2xl z-50"
            >
              <div className="p-6 border-b border-gray-200 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 ${notificationColors[selectedNotification.type].bg} rounded-lg flex items-center justify-center ${notificationColors[selectedNotification.type].icon}`}>
                    {notificationIcons[selectedNotification.type]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedNotification.title}
                    </h2>
                    <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${notificationColors[selectedNotification.type].bg} ${notificationColors[selectedNotification.type].icon} font-medium`}>
                      {notificationLabels[selectedNotification.type]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Descrição</div>
                  <p className="text-gray-900 leading-relaxed">
                    {selectedNotification.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(selectedNotification.date)} às {selectedNotification.time}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
                {selectedNotification.actionLabel && (
                  <button
                    onClick={() => {
                      markAsRead(selectedNotification.id);
                      setSelectedNotification(null);
                      // Navigate to actionUrl
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedNotification.actionLabel}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
