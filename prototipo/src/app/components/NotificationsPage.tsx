import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import {
  Bell, Calendar, CheckCircle, Clock, Users, FileText,
  X, Filter, Check, Trash2, ChevronRight, ArrowLeft,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllAsRead as markAllAsReadDb,
  type Notification,
  type NotificationType,
} from '../lib/notificacoes';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch {
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const notificationIcons: Record<NotificationType, JSX.Element> = {
    reuniao: <Users className="w-5 h-5" />,
    evento: <Calendar className="w-5 h-5" />,
    validacao: <FileText className="w-5 h-5" />,
    atualizacao: <CheckCircle className="w-5 h-5" />,
    lembrete: <Bell className="w-5 h-5" />,
    sistema: <Bell className="w-5 h-5" />,
  };

  const notificationColors: Record<NotificationType, { bg: string; border: string; icon: string; dot: string }> = {
    reuniao: { bg: 'bg-blue-50 dark:bg-fuchsia-950/70', border: 'border-blue-200 dark:border-pink-900/30', icon: 'text-blue-600 dark:text-pink-300', dot: 'bg-blue-500 dark:bg-pink-400' },
    evento: { bg: 'bg-green-50 dark:bg-emerald-950/60', border: 'border-green-200 dark:border-emerald-900/30', icon: 'text-green-600 dark:text-emerald-300', dot: 'bg-green-500 dark:bg-emerald-400' },
    validacao: { bg: 'bg-orange-50 dark:bg-amber-950/60', border: 'border-orange-200 dark:border-amber-900/30', icon: 'text-orange-600 dark:text-amber-300', dot: 'bg-orange-500 dark:bg-amber-400' },
    atualizacao: { bg: 'bg-purple-50 dark:bg-purple-950/70', border: 'border-purple-200 dark:border-purple-900/30', icon: 'text-purple-600 dark:text-purple-300', dot: 'bg-purple-500 dark:bg-purple-400' },
    lembrete: { bg: 'bg-yellow-50 dark:bg-yellow-950/60', border: 'border-yellow-200 dark:border-yellow-900/30', icon: 'text-yellow-600 dark:text-yellow-300', dot: 'bg-yellow-500 dark:bg-yellow-400' },
    sistema: { bg: 'bg-gray-50 dark:bg-[#221420]', border: 'border-gray-200 dark:border-pink-900/20', icon: 'text-gray-600 dark:text-gray-300', dot: 'bg-gray-400 dark:bg-gray-500' },
  };

  const notificationLabels: Record<NotificationType, string> = {
    reuniao: 'Reunião',
    evento: 'Evento',
    validacao: 'Validação',
    atualizacao: 'Atualização',
    lembrete: 'Lembrete',
    sistema: 'Sistema',
  };

  const priorityColors = { high: 'border-red-500', medium: 'border-yellow-500', low: 'border-gray-300 dark:border-pink-900/20' };

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    await markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllAsReadDb();
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotification?.id === id) setSelectedNotification(null);
  };

  const filteredNotifications = useMemo(() => {
    let list = notifications;
    if (filter !== 'all') list = list.filter((n) => n.type === filter);
    if (showUnreadOnly) list = list.filter((n) => !n.isRead);
    return list;
  }, [notifications, filter, showUnreadOnly]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const visibleTypes: NotificationType[] = ['reuniao', 'evento', 'validacao', 'atualizacao'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0a0f]">
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Bell className="w-8 h-8" />
                Notificações
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {isLoading ? 'Carregando...' : unreadCount > 0
                  ? <span><span className="font-semibold text-blue-600 dark:text-pink-400">{unreadCount}</span> não lida{unreadCount > 1 ? 's' : ''}</span>
                  : 'Todas as notificações foram lidas'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
              <ThemeToggle />
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0 || isLoading}
                className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-[#1a101a] border border-gray-300 dark:border-pink-900/30 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-[#221420] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                Marcar todas como lidas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleTypes.map((type) => {
            const count = notifications.filter((n) => n.type === type && !n.isRead).length;
            return (
              <motion.div
                key={type}
                whileHover={{ y: -2 }}
                onClick={() => setFilter(filter === type ? 'all' : type)}
                className={`bg-white dark:bg-[#1a101a] rounded-lg p-4 shadow-sm border-2 cursor-pointer transition-all ${filter === type ? notificationColors[type].border : 'border-gray-200 dark:border-pink-900/20 hover:border-gray-300 dark:hover:border-pink-900/30'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${notificationColors[type].bg} rounded-lg flex items-center justify-center ${notificationColors[type].icon}`}>
                    {notificationIcons[type]}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isLoading ? <span className="inline-block w-6 h-6 bg-gray-200 dark:bg-[#2c1a28] rounded animate-pulse" /> : count}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">{notificationLabels[type]}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white dark:bg-[#1a101a] rounded-lg shadow-sm border border-gray-200 dark:border-pink-900/20 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Filtros:</span>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 dark:bg-pink-600 text-white' : 'bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#2c1a28]'}`}>Todas</button>
                {visibleTypes.map((type) => (
                  <button key={type} onClick={() => setFilter(type)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === type ? 'bg-blue-600 dark:bg-pink-600 text-white' : 'bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#2c1a28]'}`}>
                    {notificationLabels[type]}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showUnreadOnly} onChange={(e) => setShowUnreadOnly(e.target.checked)} className="w-4 h-4 text-blue-600 dark:text-pink-400 rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-200">Apenas não lidas</span>
            </label>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-white dark:bg-[#1a101a] rounded-xl border border-gray-200 dark:border-pink-900/20 animate-pulse" />)}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhuma notificação</h3>
            <p className="text-gray-600 dark:text-gray-300">{showUnreadOnly ? 'Você não tem notificações não lidas' : 'Não há notificações no momento'}</p>
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
                  className={`bg-white dark:bg-[#1a101a] rounded-lg shadow-sm border-l-4 ${priorityColors[notification.priority]} overflow-hidden ${!notification.isRead ? 'border-r-4 border-r-blue-500 dark:border-r-pink-500' : ''}`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${notificationColors[notification.type].bg} rounded-lg flex items-center justify-center ${notificationColors[notification.type].icon}`}>
                        {notificationIcons[notification.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {!notification.isRead && <span className={`w-2 h-2 rounded-full ${notificationColors[notification.type].dot}`} />}
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{notification.title}</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{notification.description}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${notificationColors[notification.type].bg} ${notificationColors[notification.type].icon} font-medium whitespace-nowrap`}>
                            {notificationLabels[notification.type]}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(notification.date)} às {notification.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {notification.actionLabel && (
                            <button onClick={() => setSelectedNotification(notification)} className="px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors text-sm font-medium flex items-center gap-2">
                              {notification.actionLabel}<ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                          {!notification.isRead && (
                            <button onClick={() => markAsRead(notification.id)} className="px-4 py-2 bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2c1a28] transition-colors text-sm font-medium flex items-center gap-2">
                              <Check className="w-4 h-4" />Marcar como lida
                            </button>
                          )}
                          <button onClick={() => deleteNotification(notification.id)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Remover">
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

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNotification(null)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white dark:bg-[#1a101a] rounded-xl shadow-2xl z-50">
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 ${notificationColors[selectedNotification.type].bg} rounded-lg flex items-center justify-center ${notificationColors[selectedNotification.type].icon}`}>
                    {notificationIcons[selectedNotification.type]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedNotification.title}</h2>
                    <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${notificationColors[selectedNotification.type].bg} ${notificationColors[selectedNotification.type].icon} font-medium`}>
                      {notificationLabels[selectedNotification.type]}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedNotification(null)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-900 dark:text-white leading-relaxed">{selectedNotification.description}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(selectedNotification.date)} às {selectedNotification.time}</span>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-pink-900/20 flex gap-3">
                <button onClick={() => setSelectedNotification(null)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2c1a28] transition-colors">Fechar</button>
                {selectedNotification.actionLabel && (
                  <button onClick={() => { void markAsRead(selectedNotification.id); setSelectedNotification(null); }} className="flex-1 px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors">
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
