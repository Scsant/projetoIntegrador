import { supabase } from './supabase';

export interface PendingValidation {
  id: string;
  teacher: string;
  subject: string;
  class: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface InstitutionalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'pedagogico' | 'pais' | 'institucional' | 'planejamento';
  participants: number;
  location: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ScheduledMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
  location: string;
}

export interface DirectorStats {
  eventosInstitucionais: number;
  validacoesPendentes: number;
  reunioesProgramadas: number;
  notificacoesEnviadas: number;
}

const INSTITUTIONAL_CATEGORIES = [
  'reuniao', 'pais', 'institucional', 'planejamento', 'formacao', 'conselho_classe',
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR');
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function mapTipoEvento(categoria: string): InstitutionalEvent['type'] {
  if (categoria === 'pais') return 'pais';
  if (categoria === 'institucional') return 'institucional';
  if (categoria === 'planejamento') return 'planejamento';
  return 'pedagogico';
}

function mapPrioridade(categoria: string): InstitutionalEvent['priority'] {
  if (categoria === 'pais' || categoria === 'formacao') return 'high';
  if (categoria === 'planejamento') return 'low';
  return 'medium';
}

export async function fetchPendingValidations(): Promise<PendingValidation[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('planos_aula')
    .select(`
      id,
      status,
      referencia_data,
      criado_em,
      usuarios (nome),
      turmas (nome_exibicao),
      disciplinas (nome)
    `)
    .in('status', ['enviado', 'em_validacao'])
    .order('criado_em', { ascending: false });

  if (error || !data) return [];

  return data.map((n: any) => ({
    id: n.id,
    teacher: n.usuarios?.nome ?? 'Professor',
    subject: n.disciplinas?.nome ?? 'Disciplina',
    class: n.turmas?.nome_exibicao ?? 'Turma',
    date: n.referencia_data
      ? new Date(n.referencia_data).toLocaleDateString('pt-BR')
      : formatDate(n.criado_em),
    status: 'pending' as const,
  }));
}

export async function updateValidationStatus(
  planoId: string,
  status: 'approved' | 'rejected',
): Promise<void> {
  if (!supabase) return;
  const dbStatus = status === 'approved' ? 'aprovado' : 'rejeitado';
  await supabase.from('planos_aula').update({ status: dbStatus }).eq('id', planoId);
}

export async function fetchInstitutionalEvents(limit = 5): Promise<InstitutionalEvent[]> {
  if (!supabase) return [];

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('eventos')
    .select(`
      id,
      titulo,
      categoria,
      data_inicio,
      salas (nome),
      evento_participantes (id)
    `)
    .in('categoria', INSTITUTIONAL_CATEGORIES)
    .gte('data_inicio', now)
    .order('data_inicio', { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  return data.map((n: any) => ({
    id: n.id,
    title: n.titulo,
    date: formatDate(n.data_inicio),
    time: formatTime(n.data_inicio),
    type: mapTipoEvento(n.categoria),
    participants: Array.isArray(n.evento_participantes) ? n.evento_participantes.length : 0,
    location: n.salas?.nome ?? 'Local a definir',
    priority: mapPrioridade(n.categoria),
  }));
}

export async function fetchUpcomingMeetings(limit = 5): Promise<ScheduledMeeting[]> {
  if (!supabase) return [];

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('eventos')
    .select(`
      id,
      titulo,
      data_inicio,
      salas (nome),
      evento_participantes (nome_livre, usuarios (nome))
    `)
    .eq('categoria', 'reuniao')
    .gte('data_inicio', now)
    .order('data_inicio', { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  return data.map((n: any) => {
    const participants = Array.isArray(n.evento_participantes)
      ? n.evento_participantes
          .map((p: any) => p.usuarios?.nome ?? p.nome_livre ?? '')
          .filter(Boolean)
      : [];
    return {
      id: n.id,
      title: n.titulo,
      date: formatDate(n.data_inicio),
      time: formatTime(n.data_inicio),
      participants,
      location: n.salas?.nome ?? 'Local a definir',
    };
  });
}

export async function fetchDirectorStats(): Promise<DirectorStats> {
  if (!supabase) {
    return {
      eventosInstitucionais: 0,
      validacoesPendentes: 0,
      reunioesProgramadas: 0,
      notificacoesEnviadas: 0,
    };
  }

  const now = new Date().toISOString();

  const [
    { count: eventosInstitucionais },
    { count: validacoesPendentes },
    { count: reunioesProgramadas },
    { count: notificacoesEnviadas },
  ] = await Promise.all([
    supabase
      .from('eventos')
      .select('id', { count: 'exact', head: true })
      .in('categoria', INSTITUTIONAL_CATEGORIES),
    supabase
      .from('planos_aula')
      .select('id', { count: 'exact', head: true })
      .in('status', ['enviado', 'em_validacao']),
    supabase
      .from('eventos')
      .select('id', { count: 'exact', head: true })
      .eq('categoria', 'reuniao')
      .gte('data_inicio', now),
    supabase.from('notificacoes').select('id', { count: 'exact', head: true }),
  ]);

  return {
    eventosInstitucionais: eventosInstitucionais ?? 0,
    validacoesPendentes: validacoesPendentes ?? 0,
    reunioesProgramadas: reunioesProgramadas ?? 0,
    notificacoesEnviadas: notificacoesEnviadas ?? 0,
  };
}
