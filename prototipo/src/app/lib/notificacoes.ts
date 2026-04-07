import { supabase } from './supabase';

export type NotificationType = 'reuniao' | 'evento' | 'validacao' | 'atualizacao' | 'lembrete' | 'sistema';
export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
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

function priorityFromDb(p: string | null): NotificationPriority {
  if (p === 'alta') return 'high';
  if (p === 'baixa') return 'low';
  return 'medium';
}

function formatDate(iso: string): string {
  return new Date(iso).toISOString().split('T')[0];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export async function fetchNotifications(): Promise<Notification[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('notificacoes')
    .select(`
      id,
      tipo,
      prioridade,
      titulo,
      descricao,
      action_label,
      action_url,
      criada_em,
      notificacao_destinatarios (
        lida_em
      )
    `)
    .order('criada_em', { ascending: false });

  if (error || !data) return [];

  return data.map((n: any) => ({
    id: n.id,
    type: n.tipo as NotificationType,
    title: n.titulo,
    description: n.descricao,
    date: formatDate(n.criada_em),
    time: formatTime(n.criada_em),
    isRead: Array.isArray(n.notificacao_destinatarios)
      ? n.notificacao_destinatarios.every((d: any) => !!d.lida_em)
      : false,
    priority: priorityFromDb(n.prioridade),
    actionLabel: n.action_label ?? undefined,
    actionUrl: n.action_url ?? undefined,
  }));
}

export async function markNotificationAsRead(id: string): Promise<void> {
  if (!supabase) return;
  await supabase
    .from('notificacao_destinatarios')
    .update({ lida_em: new Date().toISOString() })
    .eq('notificacao_id', id)
    .is('lida_em', null);
}

export async function markAllAsRead(): Promise<void> {
  if (!supabase) return;
  await supabase
    .from('notificacao_destinatarios')
    .update({ lida_em: new Date().toISOString() })
    .is('lida_em', null);
}
