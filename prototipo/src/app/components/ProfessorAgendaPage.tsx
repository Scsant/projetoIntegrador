import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { fetchWeekSchedule, type TimeBlock, type ActivityType } from '../lib/professor';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  Bell,
  Clock,
  BookOpen,
  Users,
  Coffee,
  FileText,
  X,
  Download,
  Send,
  Check,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';


const timeSlots = [
  { start: '07:30', end: '08:20' },
  { start: '08:20', end: '09:10' },
  { start: '09:10', end: '10:00' },
  { start: '10:00', end: '10:20', isBreak: true },
  { start: '10:20', end: '11:10' },
  { start: '11:10', end: '12:00' },
  { start: '12:00', end: '13:00', isBreak: true },
  { start: '13:00', end: '13:50' },
  { start: '13:50', end: '14:40' },
  { start: '14:40', end: '15:30' },
  { start: '15:30', end: '16:20' }
];

export function ProfessorAgendaPage() {
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<TimeBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isUploadPlanOpen, setIsUploadPlanOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 7);
    setIsLoading(true);
    fetchWeekSchedule(monday, sunday)
      .then(setSchedule)
      .finally(() => setIsLoading(false));
  }, [currentDate]);

  const activityColors = {
    aula: { bg: 'bg-blue-50 dark:bg-fuchsia-950/70', bgLight: 'bg-blue-50 dark:bg-fuchsia-950/40', border: 'border-blue-500 dark:border-pink-500/60', text: 'text-blue-600 dark:text-pink-300' },
    planejamento: { bg: 'bg-purple-500 dark:bg-purple-950/70', bgLight: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-500 dark:border-purple-500/60', text: 'text-purple-600 dark:text-purple-300' },
    reuniao: { bg: 'bg-orange-500 dark:bg-amber-950/60', bgLight: 'bg-orange-50 dark:bg-amber-950/35', border: 'border-orange-500 dark:border-amber-500/60', text: 'text-orange-600 dark:text-amber-300' },
    evento: { bg: 'bg-green-500 dark:bg-emerald-950/60', bgLight: 'bg-green-50 dark:bg-emerald-950/35', border: 'border-green-500 dark:border-emerald-500/60', text: 'text-green-600 dark:text-emerald-300' }
  };

  const activityIcons = {
    aula: <BookOpen className="w-4 h-4" />,
    planejamento: <FileText className="w-4 h-4" />,
    reuniao: <Users className="w-4 h-4" />,
    evento: <Calendar className="w-4 h-4" />
  };

  const activityLabels = {
    aula: 'Aula',
    planejamento: 'Planejamento',
    reuniao: 'Reunião',
    evento: 'Evento Escolar'
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));
    const days = [];
    for (let i = 0; i < 5; i++) { // Monday to Friday
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getActivitiesForDay = (dayIndex: number) => {
    return schedule.filter(block => block.day === dayIndex);
  };

  const getActivityForTimeSlot = (dayIndex: number, timeSlot: string) => {
    return schedule.find(
      block => block.day === dayIndex && block.startTime === timeSlot
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();

    return (
      <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 border-b border-gray-200 dark:border-pink-900/20">
          <div className="p-4 border-r border-gray-200 dark:border-pink-900/20 bg-gray-50 dark:bg-[#221420]">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Horário</span>
          </div>
          {weekDays.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                className={`p-4 border-r border-gray-200 dark:border-pink-900/20 text-center ${isToday ? 'bg-blue-50 dark:bg-pink-900/20' : 'bg-gray-50 dark:bg-[#221420]'}`}
              >
                <div className="text-xs text-gray-600 dark:text-gray-300 uppercase mb-1">
                  {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </div>
                <div className={`text-xl font-semibold ${isToday ? 'text-blue-600 dark:text-pink-400' : 'text-gray-900 dark:text-white'}`}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time slots */}
        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
          {timeSlots.map((slot, slotIndex) => (
            <div
              key={slotIndex}
              className={`grid grid-cols-6 border-b border-gray-100 dark:border-pink-900/10 ${slot.isBreak ? 'bg-gray-50 dark:bg-[#221420]' : ''}`}
            >
              <div className="p-4 border-r border-gray-200 dark:border-pink-900/20 flex items-center gap-2">
                {slot.isBreak ? (
                  <>
                    <Coffee className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Intervalo</span>
                  </>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {slot.start}
                  </div>
                )}
              </div>
              {weekDays.map((day, dayIndex) => {
                const activity = getActivityForTimeSlot(dayIndex + 1, slot.start);
                if (slot.isBreak) {
                  return (
                    <div key={dayIndex} className="p-2 border-r border-gray-200 dark:border-pink-900/20 bg-gray-50 dark:bg-[#221420]"></div>
                  );
                }
                return (
                  <div key={dayIndex} className="p-2 border-r border-gray-200 dark:border-pink-900/20 min-h-[80px]">
                    {activity && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedBlock(activity)}
                        className={`h-full ${activityColors[activity.type].bgLight} border-l-4 ${activityColors[activity.type].border} p-3 rounded cursor-pointer`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className={`${activityColors[activity.type].text}`}>
                            {activityIcons[activity.type]}
                          </div>
                          {activity.type === 'aula' && activity.hasLessonPlan && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                          {activity.type === 'aula' && !activity.hasLessonPlan && (
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1 truncate">
                          {activity.title}
                        </div>
                        {activity.class && (
                          <div className="text-xs text-gray-600 dark:text-gray-300 truncate">{activity.class}</div>
                        )}
                        {activity.location && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{activity.location}</div>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayIndex = ((currentDate.getDay() + 6) % 7) + 1; // Convert to 1-5 (Mon-Fri)
    const activities = getActivitiesForDay(dayIndex);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20">
            <div className="p-6 border-b border-gray-200 dark:border-pink-900/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{activities.length} atividades agendadas</p>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {timeSlots.map((slot, index) => {
                const activity = getActivityForTimeSlot(dayIndex, slot.start);
                if (slot.isBreak) {
                  return (
                    <div key={index} className="flex border-b border-gray-100 dark:border-pink-900/10 bg-gray-50 dark:bg-[#221420]">
                      <div className="w-24 p-4 border-r border-gray-200 dark:border-pink-900/20 flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Intervalo</span>
                      </div>
                      <div className="flex-1 p-4"></div>
                    </div>
                  );
                }
                return (
                  <div key={index} className="flex border-b border-gray-100 dark:border-pink-900/10">
                    <div className="w-24 p-4 border-r border-gray-200 dark:border-pink-900/20 text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {slot.start}
                    </div>
                    <div className="flex-1 p-4">
                      {activity && (
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedBlock(activity)}
                          className={`${activityColors[activity.type].bgLight} border-l-4 ${activityColors[activity.type].border} p-4 rounded-lg cursor-pointer`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`${activityColors[activity.type].text}`}>
                                {activityIcons[activity.type]}
                              </div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h4>
                            </div>
                            {activity.type === 'aula' && activity.hasLessonPlan && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-emerald-950/60 text-green-700 dark:text-emerald-300 rounded text-xs font-medium">
                                <Check className="w-3 h-3" />
                                Plano enviado
                              </div>
                            )}
                            {activity.type === 'aula' && !activity.hasLessonPlan && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-amber-950/60 text-orange-700 dark:text-amber-300 rounded text-xs font-medium">
                                <AlertCircle className="w-3 h-3" />
                                Pendente
                              </div>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{activity.startTime} - {activity.endTime}</span>
                            </div>
                            {activity.class && (
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{activity.class}</span>
                              </div>
                            )}
                            {activity.location && (
                              <div className="text-gray-500 dark:text-gray-400">{activity.location}</div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumo do Dia</h3>
            <div className="space-y-4">
              {Object.entries(activityLabels).map(([key, label]) => {
                const count = activities.filter(a => a.type === key).length;
                if (count === 0) return null;
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`${activityColors[key as ActivityType].text}`}>
                        {activityIcons[key as ActivityType]}
                      </div>
                      <span className="text-gray-700 dark:text-gray-200">{label}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Planos de Aula</h3>
            <div className="space-y-2">
              {activities.filter(a => a.type === 'aula').map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#221420] rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{activity.class}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">{activity.startTime}</div>
                  </div>
                  {activity.hasLessonPlan ? (
                    <Check className="w-5 h-5 text-green-600 dark:text-emerald-300" />
                  ) : (
                    <button
                      onClick={() => setIsUploadPlanOpen(true)}
                      className="text-xs text-blue-600 dark:text-pink-400 hover:text-blue-700 font-medium"
                    >
                      Enviar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Minha Agenda</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Prof. João Silva - Matemática</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setIsUploadPlanOpen(true)}
                className="px-4 py-2 bg-white dark:bg-[#1a101a] border border-gray-300 dark:border-pink-900/30 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-[#221420] transition-colors flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Enviar Plano
              </button>
              <button
                onClick={() => setIsAddActivityOpen(true)}
                className="px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar Atividade
              </button>
              <button className="relative p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2c1a28] rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-[#1a101a] border-b border-gray-200 dark:border-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#2c1a28] rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[250px] text-center">
                {viewMode === 'week'
                  ? `Semana de ${getWeekDays()[0].getDate()} - ${getWeekDays()[4].getDate()} de ${getWeekDays()[0].toLocaleDateString('pt-BR', { month: 'long' })}`
                  : currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h2>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#2c1a28] rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hoje
              </button>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#221420] rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-white dark:bg-[#2c1a28] text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'day'
                    ? 'bg-white dark:bg-[#2c1a28] text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Dia
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-[#1a101a] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-fuchsia-950/70 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-pink-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? <span className="animate-pulse">—</span> : schedule.filter(b => b.type === 'aula').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Aulas/semana</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a101a] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-emerald-950/60 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600 dark:text-emerald-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? <span className="animate-pulse">—</span> : schedule.filter(b => b.type === 'aula' && b.hasLessonPlan).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Planos enviados</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a101a] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-amber-950/60 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-amber-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? <span className="animate-pulse">—</span> : schedule.filter(b => b.type === 'aula' && !b.hasLessonPlan).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Pendentes</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a101a] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-pink-900/20 dark:border-pink-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/70 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? <span className="animate-pulse">—</span> : new Set(schedule.filter(b => b.class).map(b => b.class)).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Turmas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-12 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-[#221420] rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-gray-200 dark:bg-[#221420] rounded w-1/2 mx-auto" />
                  <div className="h-4 bg-gray-200 dark:bg-[#221420] rounded w-2/3 mx-auto" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">Carregando agenda...</p>
              </div>
            ) : viewMode === 'week' ? renderWeekView() : renderDayView()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedBlock && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlock(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-xl shadow-2xl z-50"
            >
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`${activityColors[selectedBlock.type].text}`}>
                        {activityIcons[selectedBlock.type]}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedBlock.title}</h2>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${activityColors[selectedBlock.type].bgLight} ${activityColors[selectedBlock.type].text}`}>
                      {activityLabels[selectedBlock.type]}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedBlock(null)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Horário</div>
                    <div className="text-gray-600 dark:text-gray-300">{selectedBlock.startTime} - {selectedBlock.endTime}</div>
                  </div>
                </div>
                {selectedBlock.class && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Turma</div>
                      <div className="text-gray-600 dark:text-gray-300">{selectedBlock.class}</div>
                    </div>
                  </div>
                )}
                {selectedBlock.location && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Local</div>
                      <div className="text-gray-600 dark:text-gray-300">{selectedBlock.location}</div>
                    </div>
                  </div>
                )}
                {selectedBlock.description && (
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white mb-1">Descrição</div>
                    <p className="text-gray-600 dark:text-gray-300">{selectedBlock.description}</p>
                  </div>
                )}
                {selectedBlock.type === 'aula' && (
                  <div className="pt-4 border-t border-gray-200 dark:border-pink-900/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900 dark:text-white">Plano de Aula</span>
                      {selectedBlock.hasLessonPlan ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <Check className="w-4 h-4" />
                          Enviado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          Pendente
                        </span>
                      )}
                    </div>
                    {selectedBlock.hasLessonPlan ? (
                      <button className="w-full px-4 py-2 bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Baixar Plano
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedBlock(null);
                          setIsUploadPlanOpen(true);
                        }}
                        className="w-full px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Enviar Plano
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upload Lesson Plan Modal */}
      <AnimatePresence>
        {isUploadPlanOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadPlanOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-xl shadow-2xl z-50"
            >
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enviar Plano de Aula</h2>
                <button
                  onClick={() => setIsUploadPlanOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Turma
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none">
                    <option>9º A - Matemática</option>
                    <option>8º B - Matemática</option>
                    <option>7º C - Matemática</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Data da Aula
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Arquivo do Plano
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-pink-900/30 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-300 mb-1">Clique ou arraste o arquivo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">PDF, DOC, DOCX até 10MB</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Adicione observações sobre o plano..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </form>
              <div className="p-6 border-t border-gray-200 dark:border-pink-900/20 flex gap-3">
                <button
                  onClick={() => setIsUploadPlanOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setIsUploadPlanOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Enviar Plano
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {isAddActivityOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddActivityOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-xl shadow-2xl z-50"
            >
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Adicionar Atividade</h2>
                <button
                  onClick={() => setIsAddActivityOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Tipo de Atividade
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none">
                    <option value="planejamento">Planejamento</option>
                    <option value="reuniao">Reunião</option>
                    <option value="evento">Evento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Correção de Provas"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Data
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Horário
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detalhes da atividade..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </form>
              <div className="p-6 border-t border-gray-200 dark:border-pink-900/20 flex gap-3">
                <button
                  onClick={() => setIsAddActivityOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setIsAddActivityOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}




