import { supabase, supabaseDefaults } from './supabase';

export type AgendaCategory = 'reuniao' | 'avaliacao' | 'planejamento' | 'tutoria' | 'pais';

export interface AgendaEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  category: AgendaCategory;
  location: string;
  participants: string[];
  description: string;
  color: string;
}

export interface AgendaEventInput {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  category: AgendaCategory;
  location: string;
  participants: string[];
  description: string;
}

const categoryColorMap: Record<AgendaCategory, string> = {
  reuniao: 'blue',
  avaliacao: 'purple',
  planejamento: 'orange',
  tutoria: 'cyan',
  pais: 'green',
};

const allowedCategories: AgendaCategory[] = ['reuniao', 'avaliacao', 'planejamento', 'tutoria', 'pais'];

function normalizeCategory(value: string | null | undefined): AgendaCategory {
  if (value && allowedCategories.includes(value as AgendaCategory)) {
    return value as AgendaCategory;
  }

  switch (value) {
    case 'institucional':
    case 'conselho_classe':
    case 'formacao':
      return 'reuniao';
    case 'aula':
    case 'apoio_presencial':
      return 'avaliacao';
    default:
      return 'planejamento';
  }
}

function formatTime(dateValue: string | null | undefined): string {
  if (!dateValue) return '00:00';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '00:00';
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function combineDateTime(date: string, time: string): string {
  return `${date}T${time}:00`;
}

function extractParticipants(record: any): string[] {
  const rows = Array.isArray(record?.evento_participantes) ? record.evento_participantes : [];

  return rows
    .map((participant: any) => {
      if (participant?.usuarios?.nome) return participant.usuarios.nome;
      if (participant?.turmas?.nome_exibicao) return participant.turmas.nome_exibicao;
      if (participant?.nome_livre) return participant.nome_livre;
      return null;
    })
    .filter(Boolean);
}

function mapEventRecord(record: any): AgendaEvent {
  const category = normalizeCategory(record.categoria);
  const start = record.data_inicio ? new Date(record.data_inicio) : new Date();

  return {
    id: record.id,
    title: record.titulo ?? 'Evento sem titulo',
    date: start,
    startTime: formatTime(record.data_inicio),
    endTime: formatTime(record.data_fim),
    category,
    location: record.salas?.nome ?? 'Local a definir',
    participants: extractParticipants(record),
    description: record.descricao ?? '',
    color: categoryColorMap[category],
  };
}

export async function fetchAgendaEvents(): Promise<AgendaEvent[]> {
  if (!supabase) {
    throw new Error('Supabase nao configurado');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const { data, error } = await supabase
      .from('eventos')
      .select(`
        id,
        titulo,
        descricao,
        categoria,
        data_inicio,
        data_fim,
        salas (
          nome
        ),
        evento_participantes (
          nome_livre,
          usuarios (
            nome
          ),
          turmas (
            nome_exibicao
          )
        )
      `)
      .order('data_inicio', { ascending: true })
      .abortSignal(controller.signal);

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapEventRecord);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function resolveSalaId(location: string): Promise<string | null> {
  if (!supabase || !location.trim()) return null;

  const { data, error } = await supabase
    .from('salas')
    .select('id')
    .ilike('nome', location.trim())
    .maybeSingle();

  if (error) {
    return null;
  }

  return data?.id ?? null;
}

export async function createAgendaEvent(input: AgendaEventInput): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase nao configurado');
  }

  if (!supabaseDefaults.calendarId || !supabaseDefaults.userId) {
    throw new Error('Defina VITE_SUPABASE_DEFAULT_CALENDAR_ID e VITE_SUPABASE_DEFAULT_USER_ID');
  }

  const salaId = await resolveSalaId(input.location);
  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from('eventos')
    .insert({
      id: crypto.randomUUID(),
      calendario_id: supabaseDefaults.calendarId,
      criado_por_usuario_id: supabaseDefaults.userId,
      responsavel_usuario_id: supabaseDefaults.userId,
      sala_id: salaId,
      titulo: input.title,
      descricao: input.description,
      categoria: input.category,
      status: 'agendado',
      data_inicio: combineDateTime(input.date, input.startTime),
      data_fim: combineDateTime(input.date, input.endTime),
      dia_inteiro: false,
      recorrencia_tipo: 'nenhuma',
      recorrencia_intervalo: 1,
      origem: 'manual',
      criado_em: timestamp,
      atualizado_em: timestamp,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  const participants = input.participants
    .map((participant) => participant.trim())
    .filter(Boolean)
    .map((participant) => ({
      id: crypto.randomUUID(),
      evento_id: data.id,
      nome_livre: participant,
      tipo_participante: 'convidado',
      confirmou_presenca: false,
    }));

  if (participants.length === 0) {
    return;
  }

  const { error: participantError } = await supabase
    .from('evento_participantes')
    .insert(participants);

  if (participantError) {
    throw participantError;
  }
}
