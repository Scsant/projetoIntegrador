
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  X,
  Clock,
  MapPin,
  Users,
  Bell,
  Edit,
  Trash2,
  MoreVertical,
  ArrowLeft,
  Database,
  RefreshCw,
} from 'lucide-react';
import { createAgendaEvent, fetchAgendaEvents, type AgendaCategory, type AgendaEvent } from '../lib/agenda';
import { hasSupabaseEnv } from '../lib/supabase';
import { ThemeToggle } from './ThemeToggle';

type ViewMode = 'month' | 'week' | 'day';
type ConnectionState = 'mock' | 'loading' | 'connected' | 'error';

interface CreateEventForm {
  title: string;
  date: string;
  category: AgendaCategory;
  startTime: string;
  endTime: string;
  location: string;
  participants: string;
  description: string;
}

const mockEvents: AgendaEvent[] = [
  {
    id: '1',
    title: 'Reuniao Pedagogica',
    date: new Date(2026, 2, 7),
    startTime: '09:00',
    endTime: '10:30',
    category: 'reuniao',
    location: 'Sala 3',
    participants: ['Prof. Joao', 'Prof. Maria', 'Coord. Ana'],
    description: 'Reuniao mensal para alinhamento pedagogico',
    color: 'blue',
  },
  {
    id: '2',
    title: 'Avaliacao Diagnostica - 9 Ano',
    date: new Date(2026, 2, 7),
    startTime: '14:00',
    endTime: '15:30',
    category: 'avaliacao',
    location: 'Sala 12',
    participants: ['Prof. Carlos', 'Turma 9A'],
    description: 'Avaliacao diagnostica de matematica',
    color: 'purple',
  },
  {
    id: '3',
    title: 'Reuniao de Pais - 6 Ano',
    date: new Date(2026, 2, 8),
    startTime: '18:00',
    endTime: '20:00',
    category: 'pais',
    location: 'Auditorio',
    participants: ['Pais 6 Ano', 'Prof. Responsaveis'],
    description: 'Reuniao bimestral com pais',
    color: 'green',
  },
  {
    id: '4',
    title: 'Planejamento Escolar 2026',
    date: new Date(2026, 2, 10),
    startTime: '10:00',
    endTime: '12:00',
    category: 'planejamento',
    location: 'Sala de Reunioes',
    participants: ['Direcao', 'Coordenacao'],
    description: 'Planejamento estrategico do semestre',
    color: 'orange',
  },
  {
    id: '5',
    title: 'Tutoria Individual - Matematica',
    date: new Date(2026, 2, 10),
    startTime: '15:00',
    endTime: '16:00',
    category: 'tutoria',
    location: 'Sala 5',
    participants: ['Prof. Joao', 'Aluno Pedro'],
    description: 'Acompanhamento individual',
    color: 'cyan',
  },
];

const initialFormState: CreateEventForm = {
  title: '',
  date: new Date().toLocaleDateString('sv-SE'),  // Data local no formato YYYY-MM-DD
  category: 'reuniao',
  startTime: '09:00',
  endTime: '10:00',
  location: '',
  participants: '',
  description: '',
};

export function AgendaPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<AgendaEvent[]>(mockEvents);
  const [connectionState, setConnectionState] = useState<ConnectionState>(hasSupabaseEnv ? 'loading' : 'mock');
  const [statusMessage, setStatusMessage] = useState(
    hasSupabaseEnv
      ? 'Conectando agenda ao Supabase...'
      : 'Supabase ainda nao configurado. Exibindo dados mock do prototipo.'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<CreateEventForm>(initialFormState);

  const categoryLabels: Record<AgendaCategory, string> = {
    reuniao: 'Reuniao',
    avaliacao: 'Avaliacao',
    planejamento: 'Planejamento',
    tutoria: 'Tutoria',
    pais: 'Reuniao de Pais',
  };

  const categoryColors: Record<AgendaCategory, string> = {
    reuniao: 'bg-blue-500',
    avaliacao: 'bg-purple-500',
    planejamento: 'bg-orange-500',
    tutoria: 'bg-cyan-500',
    pais: 'bg-green-500',
  };

  async function loadEvents() {
    if (!hasSupabaseEnv) {
      setEvents(mockEvents);
      setConnectionState('mock');
      setStatusMessage('Supabase ainda nao configurado. Exibindo dados mock do prototipo.');
      return;
    }

    setConnectionState('loading');
    setStatusMessage('Carregando eventos reais do Supabase...');

    try {
      const databaseEvents = await fetchAgendaEvents();

      if (databaseEvents.length === 0) {
        setEvents([]);
        setConnectionState('connected');
        setStatusMessage('Conexao com Supabase ativa. Ainda nao ha eventos cadastrados.');
        return;
      }

      setEvents(databaseEvents);
      setConnectionState('connected');
      setStatusMessage(`Conexao com Supabase ativa. ${databaseEvents.length} evento(s) carregado(s).`);
    } catch (error) {
      console.error(error);
      setEvents(mockEvents);
      setConnectionState('error');
      setStatusMessage('Nao foi possivel ler os eventos no Supabase. Mantive os mocks para nao travar a tela.');
    }
  }

  useEffect(() => {
    void loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return events;

    return events.filter((event) => {
      return [event.title, event.description, event.location, ...event.participants]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [events, searchTerm]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getDateString = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
    if (viewMode === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.getDate()} - ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getWeekDays = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter((event) => event.date.toDateString() === date.toDateString());
  };

  const handleFormChange = (field: keyof CreateEventForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleCreateEvent = async () => {
    if (!form.title.trim()) {
      setStatusMessage('Preencha pelo menos o titulo do evento antes de salvar.');
      return;
    }

    const localEvent: AgendaEvent = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      date: new Date(`${form.date}T${form.startTime}:00`),
      startTime: form.startTime,
      endTime: form.endTime,
      category: form.category,
      location: form.location.trim() || 'Local a definir',
      participants: form.participants.split(',').map((participant) => participant.trim()).filter(Boolean),
      description: form.description.trim(),
      color: {
        reuniao: 'blue',
        avaliacao: 'purple',
        planejamento: 'orange',
        tutoria: 'cyan',
        pais: 'green',
      }[form.category],
    };

    if (!hasSupabaseEnv) {
      setEvents((current) => [...current, localEvent]);
      setStatusMessage('Evento criado apenas localmente, porque o Supabase ainda nao foi configurado.');
      setIsCreateModalOpen(false);
      resetForm();
      return;
    }

    try {
      setIsSaving(true);
      await createAgendaEvent({
        title: form.title.trim(),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        category: form.category,
        location: form.location,
        participants: form.participants.split(','),
        description: form.description.trim(),
      });
      setStatusMessage('Evento salvo no Supabase com sucesso.');
      setIsCreateModalOpen(false);
      resetForm();
      await loadEvents();
    } catch (error) {
      console.error(error);
      setStatusMessage('A conexao existe, mas o salvamento falhou. Verifique as variaveis e os registros base do banco.');
    } finally {
      setIsSaving(false);
    }
  };
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return (
      <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-6">
        <div className="overflow-x-auto pb-2"><div className="min-w-[560px]"><div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-300 py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 min-w-[560px]">
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.02 }}
                className={`aspect-square rounded-lg border p-2 cursor-pointer transition-all ${isToday ? 'bg-blue-50 dark:bg-pink-900/20 border-blue-500 dark:border-pink-500' : 'bg-white dark:bg-[#1a101a] border-gray-200 dark:border-pink-900/20 hover:border-blue-300 dark:hover:border-violet-700/50'}`}
                onClick={() => {
                  setCurrentDate(date);
                  setViewMode('day');
                }}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600 dark:text-pink-400' : 'text-gray-900 dark:text-white'}`}>{day}</div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className={`text-xs px-1 py-0.5 rounded truncate ${categoryColors[event.category]} bg-opacity-20 text-gray-900 dark:text-white`}>
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="text-xs text-gray-500 dark:text-gray-400">+{dayEvents.length - 2}</div>}
                </div>
              </motion.div>
            );
          })}
        </div>
        </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);

    return (
      <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 overflow-hidden">
        <div className="overflow-x-auto"><div className="min-w-[720px]"><div className="grid grid-cols-8 border-b border-gray-200 dark:border-pink-900/20">
          <div className="p-4 border-r border-gray-200 dark:border-pink-900/20"></div>
          {weekDays.map((day) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div key={day.toISOString()} className={`p-4 text-center border-r border-gray-200 dark:border-pink-900/20 ${isToday ? 'bg-blue-50 dark:bg-pink-900/20' : ''}`}>
                <div className="text-xs text-gray-600 dark:text-gray-300 uppercase">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                <div className={`text-xl font-semibold ${isToday ? 'text-blue-600 dark:text-pink-400' : 'text-gray-900 dark:text-white'}`}>{day.getDate()}</div>
              </div>
            );
          })}
        </div>
        <div className="overflow-y-auto max-h-[600px]">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-100 dark:border-pink-900/10">
              <div className="p-4 border-r border-gray-200 dark:border-pink-900/20 text-sm text-gray-600 dark:text-gray-300 font-medium">{String(hour).padStart(2, '0')}:00</div>
              {weekDays.map((day) => {
                const hourEvents = getEventsForDate(day).filter((event) => parseInt(event.startTime.split(':')[0], 10) === hour);
                return (
                  <div key={day.toISOString()} className="p-2 border-r border-gray-200 dark:border-pink-900/20 min-h-[80px]">
                    {hourEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedEvent(event)}
                        className={`${categoryColors[event.category]} bg-opacity-20 border-l-4 ${categoryColors[event.category]} p-2 rounded cursor-pointer mb-2`}
                      >
                        <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">{event.title}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">{event.startTime} - {event.endTime}</div>
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20">
            <div className="p-6 border-b border-gray-200 dark:border-pink-900/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{dayEvents.length} eventos agendados</p>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {hours.map((hour) => {
                const hourEvents = dayEvents.filter((event) => parseInt(event.startTime.split(':')[0], 10) === hour);
                return (
                  <div key={hour} className="flex border-b border-gray-100 dark:border-pink-900/10">
                    <div className="w-24 p-4 border-r border-gray-200 dark:border-pink-900/20 text-sm text-gray-600 dark:text-gray-300 font-medium">{String(hour).padStart(2, '0')}:00</div>
                    <div className="flex-1 p-4">
                      {hourEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedEvent(event)}
                          className={`${categoryColors[event.category]} bg-opacity-20 border-l-4 ${categoryColors[event.category]} p-4 rounded-lg cursor-pointer mb-3`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><MoreVertical className="w-4 h-4" /></button>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{event.startTime} - {event.endTime}</span></div>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{event.location}</span></div>
                            <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>{event.participants.length} participantes</span></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumo do Dia</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-gray-600 dark:text-gray-300">Total de Eventos</span><span className="text-2xl font-bold text-gray-900 dark:text-white">{dayEvents.length}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-600 dark:text-gray-300">Participantes</span><span className="text-2xl font-bold text-gray-900 dark:text-white">{dayEvents.reduce((acc, event) => acc + event.participants.length, 0)}</span></div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a101a] rounded-xl shadow-sm border border-gray-200 dark:border-pink-900/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categorias</h3>
            <div className="space-y-2">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const count = dayEvents.filter((event) => event.category === key).length;
                if (count === 0) return null;
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${categoryColors[key as AgendaCategory]}`}></div><span className="text-gray-700 dark:text-gray-200">{label}</span></div>
                    <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0a0f]">
      <div className="bg-white dark:bg-[#1a101a] border-b border-gray-200 dark:border-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link to="/dashboard" className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#221420] rounded-lg transition-colors">
                  <ArrowLeft className="w-4 h-4" />Voltar para Home
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agenda Escolar</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Gerencie todos os eventos da escola</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 lg:flex-none lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input type="text" placeholder="Buscar eventos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none dark:bg-[#221420] dark:text-white dark:placeholder:text-gray-500" />
              </div>
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="px-4 py-2 bg-white dark:bg-[#1a101a] border border-gray-300 dark:border-pink-900/30 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-[#221420] transition-colors flex items-center gap-2"><Filter className="w-5 h-5" />Filtros</button>
              <button onClick={() => void loadEvents()} className="px-4 py-2 bg-white dark:bg-[#1a101a] border border-gray-300 dark:border-pink-900/30 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-[#221420] transition-colors flex items-center gap-2"><RefreshCw className={`w-5 h-5 ${connectionState === 'loading' ? 'animate-spin' : ''}`} />Atualizar</button>
              <ThemeToggle />
              <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors flex items-center gap-2"><Plus className="w-5 h-5" />Criar Evento</button>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-gray-200 dark:border-pink-900/20 bg-gray-50 dark:bg-[#221420] px-4 py-3">
            <Database className="mt-0.5 h-5 w-5 text-blue-600 dark:text-pink-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {connectionState === 'connected' && 'Supabase conectado'}
                {connectionState === 'loading' && 'Carregando dados reais'}
                {connectionState === 'mock' && 'Modo prototipo'}
                {connectionState === 'error' && 'Conexao com fallback'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{statusMessage}</p>
            </div>
          </div>
          {isFilterOpen && <div className="mt-4 rounded-xl border border-dashed border-gray-300 dark:border-pink-900/30 bg-white dark:bg-[#1a101a] px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Filtros avancados ainda nao foram ligados ao banco. Por enquanto, a busca por texto ja esta funcionando.</div>}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a101a] border-b border-gray-200 dark:border-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => navigateDate('prev')} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2c1a28] rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" /></button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize min-w-[200px] text-center">{getDateString()}</h2>
              <button onClick={() => navigateDate('next')} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2c1a28] rounded-lg transition-colors"><ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2c1a28] transition-colors">Hoje</button>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#221420] rounded-lg p-1">
              <button onClick={() => setViewMode('month')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'month' ? 'bg-white dark:bg-[#2c1a28] text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>Mes</button>
              <button onClick={() => setViewMode('week')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'week' ? 'bg-white dark:bg-[#2c1a28] text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>Semana</button>
              <button onClick={() => setViewMode('day')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'day' ? 'bg-white dark:bg-[#2c1a28] text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>Dia</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'day' && renderDayView()}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEvent(null)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white dark:bg-[#1a101a] rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedEvent.title}</h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColors[selectedEvent.category]} bg-opacity-20 text-gray-900 dark:text-white`}>{categoryLabels[selectedEvent.category]}</span>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-start gap-3"><Clock className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" /><div><div className="font-medium text-gray-900 dark:text-white">Horario</div><div className="text-gray-600 dark:text-gray-300">{selectedEvent.startTime} - {selectedEvent.endTime}</div><div className="text-sm text-gray-500 dark:text-gray-400">{selectedEvent.date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div></div></div>
                  <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" /><div><div className="font-medium text-gray-900 dark:text-white">Local</div><div className="text-gray-600 dark:text-gray-300">{selectedEvent.location}</div></div></div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white mb-2">Participantes</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.participants.length > 0 ? selectedEvent.participants.map((participant, index) => (
                          <span key={`${participant}-${index}`} className="px-3 py-1 bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-full text-sm">{participant}</span>
                        )) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Nenhum participante registrado.</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div><div className="font-medium text-gray-900 dark:text-white mb-2">Descricao</div><p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedEvent.description || 'Sem descricao adicional.'}</p></div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-pink-900/20 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"><Edit className="w-4 h-4" />Editar</button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"><Bell className="w-4 h-4" />Notificar</button>
                <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreateModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white dark:bg-[#1a101a] rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-pink-900/20 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Evento</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-6 h-6" /></button>
              </div>
              <form className="p-6 space-y-6 max-h-[60vh] overflow-y-auto" onSubmit={(event) => { event.preventDefault(); void handleCreateEvent(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Titulo do Evento</label>
                  <input type="text" value={form.title} onChange={(event) => handleFormChange('title', event.target.value)} placeholder="Ex: Reuniao Pedagogica" className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none dark:bg-[#221420] dark:text-white dark:placeholder:text-gray-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Data</label><input type="date" value={form.date} onChange={(event) => handleFormChange('date', event.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none dark:bg-[#221420] dark:text-white dark:placeholder:text-gray-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Categoria</label><select value={form.category} onChange={(event) => handleFormChange('category', event.target.value as AgendaCategory)} className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none dark:bg-[#221420] dark:text-white">{Object.entries(categoryLabels).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}</select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Inicio</label><input type="time" value={form.startTime} onChange={(event) => handleFormChange('startTime', event.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none dark:bg-[#221420] dark:text-white dark:placeholder:text-gray-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Termino</label><input type="time" value={form.endTime} onChange={(event) => handleFormChange('endTime', event.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none dark:bg-[#221420] dark:text-white dark:placeholder:text-gray-500" /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Local</label>
                  <input type="text" value={form.location} onChange={(event) => handleFormChange('location', event.target.value)} placeholder="Ex: Sala 3" className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none dark:bg-[#221420] dark:text-white dark:placeholder:text-gray-500" />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Se esse local ja existir na tabela `salas`, o evento sera vinculado automaticamente.</p>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Participantes</label><input type="text" value={form.participants} onChange={(event) => handleFormChange('participants', event.target.value)} placeholder="Adicionar participantes separados por virgula" className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none dark:bg-[#221420] dark:text-white dark:placeholder:text-gray-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Descricao</label><textarea rows={4} value={form.description} onChange={(event) => handleFormChange('description', event.target.value)} placeholder="Detalhes do evento..." className="w-full px-4 py-2 border border-gray-300 dark:border-pink-900/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-pink-500 focus:border-transparent outline-none resize-none dark:bg-[#221420] dark:text-white dark:placeholder:text-gray-500" /></div>
              </form>
              <div className="p-6 border-t border-gray-200 dark:border-pink-900/20 flex gap-3">
                <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#221420] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2c1a28] transition-colors">Cancelar</button>
                <button onClick={() => void handleCreateEvent()} disabled={isSaving} className="flex-1 px-4 py-2 bg-blue-600 dark:bg-pink-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-pink-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{isSaving ? 'Salvando...' : 'Criar Evento'}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}




