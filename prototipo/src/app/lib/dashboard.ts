import { supabase, supabaseDefaults } from './supabase';
import { fetchAgendaEvents, type AgendaEvent } from './agenda';

export interface DashboardStats {
  eventosHoje: number;
  reunioesSemana: number;
  notificacoesNaoLidas: number;
  atividadesPendentes: number;
}

export interface DashboardNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'alert';
  unread: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `Há ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours} hora${hours !== 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  return `Há ${days} dia${days !== 1 ? 's' : ''}`;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  if (!supabase) return { eventosHoje: 0, reunioesSemana: 0, notificacoesNaoLidas: 0, atividadesPendentes: 0 };

  const hoje = new Date();
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).toISOString();
  const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1).toISOString();

  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());
  inicioSemana.setHours(0, 0, 0, 0);
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 7);

  const [
    { count: eventosHoje },
    { count: reunioesSemana },
    { count: notificacoesNaoLidas },
    { count: atividadesPendentes },
  ] = await Promise.all([
    supabase
      .from('eventos')
      .select('id', { count: 'exact', head: true })
      .gte('data_inicio', inicioHoje)
      .lt('data_inicio', fimHoje),
    supabase
      .from('eventos')
      .select('id', { count: 'exact', head: true })
      .eq('categoria', 'reuniao')
      .gte('data_inicio', inicioSemana.toISOString())
      .lt('data_inicio', fimSemana.toISOString()),
    supabase
      .from('notificacao_destinatarios')
      .select('id', { count: 'exact', head: true })
      .is('lida_em', null),
    supabase
      .from('planos_aula')
      .select('id', { count: 'exact', head: true })
      .in('status', ['enviado', 'em_validacao']),
  ]);

  return {
    eventosHoje: eventosHoje ?? 0,
    reunioesSemana: reunioesSemana ?? 0,
    notificacoesNaoLidas: notificacoesNaoLidas ?? 0,
    atividadesPendentes: atividadesPendentes ?? 0,
  };
}

export async function fetchUpcomingEvents(limit = 5): Promise<AgendaEvent[]> {
  const all = await fetchAgendaEvents();
  const now = new Date();
  return all
    .filter((e) => e.date >= now)
    .slice(0, limit);
}

export async function fetchDashboardNotifications(limit = 4): Promise<DashboardNotification[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('notificacoes')
    .select(`
      id,
      titulo,
      descricao,
      tipo,
      criada_em,
      notificacao_destinatarios (
        lida_em
      )
    `)
    .order('criada_em', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const typeMap: Record<string, 'info' | 'warning' | 'alert'> = {
    reuniao: 'info',
    evento: 'info',
    lembrete: 'warning',
    validacao: 'alert',
    atualizacao: 'info',
    sistema: 'info',
  };

  return data.map((n: any) => ({
    id: n.id,
    title: n.titulo,
    description: n.descricao,
    time: timeAgo(n.criada_em),
    type: typeMap[n.tipo] ?? 'info',
    unread: Array.isArray(n.notificacao_destinatarios)
      ? n.notificacao_destinatarios.some((d: any) => !d.lida_em)
      : true,
  }));
}

export async function fetchEventDays(year: number, month: number): Promise<number[]> {
  if (!supabase) return [];

  const inicio = new Date(year, month, 1).toISOString();
  const fim = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const { data, error } = await supabase
    .from('eventos')
    .select('data_inicio')
    .gte('data_inicio', inicio)
    .lte('data_inicio', fim);

  if (error || !data) return [];

  return [...new Set(data.map((e: any) => new Date(e.data_inicio).getDate()))];
}
