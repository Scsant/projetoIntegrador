import { supabase } from './supabase';

export type ActivityType = 'aula' | 'planejamento' | 'reuniao' | 'evento';

export interface TimeBlock {
  id: string;
  day: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string;
  endTime: string;
  type: ActivityType;
  title: string;
  subject?: string;
  class?: string;
  location?: string;
  description?: string;
  hasLessonPlan?: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function mapCategoria(categoria: string): ActivityType {
  if (categoria === 'aula' || categoria === 'apoio_presencial') return 'aula';
  if (categoria === 'planejamento') return 'planejamento';
  if (categoria === 'reuniao') return 'reuniao';
  return 'evento';
}

export async function fetchWeekSchedule(weekStart: Date, weekEnd: Date): Promise<TimeBlock[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('eventos')
    .select(`
      id,
      titulo,
      descricao,
      categoria,
      data_inicio,
      data_fim,
      salas (nome),
      disciplinas (nome),
      turmas (nome_exibicao),
      planos_aula (id, status)
    `)
    .gte('data_inicio', weekStart.toISOString())
    .lt('data_inicio', weekEnd.toISOString())
    .order('data_inicio', { ascending: true });

  if (error || !data) return [];

  return data.map((n: any) => ({
    id: n.id,
    day: new Date(n.data_inicio).getDay(),
    startTime: formatTime(n.data_inicio),
    endTime: formatTime(n.data_fim),
    type: mapCategoria(n.categoria),
    title: n.titulo,
    subject: n.disciplinas?.nome ?? undefined,
    class: n.turmas?.nome_exibicao ?? undefined,
    location: n.salas?.nome ?? undefined,
    description: n.descricao ?? undefined,
    hasLessonPlan:
      Array.isArray(n.planos_aula) &&
      n.planos_aula.some((p: any) => p.status !== 'rascunho'),
  }));
}
