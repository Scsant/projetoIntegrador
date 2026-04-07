import { supabase } from './supabase';

export interface TeamStats {
  professores: number;
  coordenadores: number;
  direcao: number;
  total: number;
}

export interface SpecialDate {
  id: string;
  title: string;
  date: string;
  isoDate: string;
  type: string;
}

export interface SpecialDateStats {
  totalAno: number;
  proximaData: SpecialDate | null;
  proximas: SpecialDate[];
}

export interface Aviso {
  id: string;
  titulo: string;
  conteudo: string;
  autor: string;
  fixado: boolean;
  criadoEm: string;
  timeAgo: string;
}

// ─── Team ───────────────────────────────────────────────────────────────────

export async function fetchTeamStats(): Promise<TeamStats> {
  if (!supabase) return { professores: 0, coordenadores: 0, direcao: 0, total: 0 };

  const { data, error } = await supabase.from('usuarios').select('papel');
  if (error || !data) return { professores: 0, coordenadores: 0, direcao: 0, total: 0 };

  const stats: TeamStats = { professores: 0, coordenadores: 0, direcao: 0, total: 0 };
  data.forEach((u: any) => {
    stats.total++;
    if (u.papel === 'professor') stats.professores++;
    else if (u.papel === 'coordenador') stats.coordenadores++;
    else if (u.papel === 'diretor' || u.papel === 'vice_diretor') stats.direcao++;
  });
  return stats;
}

// ─── Datas Especiais / Feriados ─────────────────────────────────────────────

function formatDateBR(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export async function fetchSpecialDateStats(): Promise<SpecialDateStats> {
  if (!supabase) return { totalAno: 0, proximaData: null, proximas: [] };

  const year = new Date().getFullYear();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('calendario_excecoes')
    .select('id, titulo, tipo, data_inicio')
    .gte('data_inicio', `${year}-01-01`)
    .lte('data_inicio', `${year}-12-31`)
    .order('data_inicio', { ascending: true });

  if (error || !data) return { totalAno: 0, proximaData: null, proximas: [] };

  const all: SpecialDate[] = data.map((d: any) => ({
    id: d.id,
    title: d.titulo,
    date: formatDateBR(d.data_inicio),
    isoDate: d.data_inicio,
    type: d.tipo ?? 'outro',
  }));

  const upcoming = all.filter((d) => d.isoDate >= now);
  return {
    totalAno: all.length,
    proximaData: upcoming[0] ?? null,
    proximas: upcoming.slice(0, 4),
  };
}

// ─── Mural de Avisos ─────────────────────────────────────────────────────────
// Requires the following table in Supabase:
//
//   CREATE TABLE avisos (
//     id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//     autor_nome  varchar(200) NOT NULL DEFAULT 'Equipe',
//     titulo      varchar(200) NOT NULL,
//     conteudo    text NOT NULL,
//     fixado      boolean NOT NULL DEFAULT false,
//     criado_em   timestamp NOT NULL DEFAULT now()
//   );

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Agora mesmo';
  if (minutes < 60) return `Há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Há ${days} dia${days !== 1 ? 's' : ''}`;
}

export async function fetchAvisos(): Promise<Aviso[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('avisos')
    .select('id, titulo, conteudo, autor_nome, fixado, criado_em')
    .order('fixado', { ascending: false })
    .order('criado_em', { ascending: false })
    .limit(10);

  if (error || !data) return []; // table may not exist yet

  return data.map((a: any) => ({
    id: a.id,
    titulo: a.titulo,
    conteudo: a.conteudo,
    autor: a.autor_nome ?? 'Equipe',
    fixado: a.fixado ?? false,
    criadoEm: a.criado_em,
    timeAgo: timeAgo(a.criado_em),
  }));
}

export async function createAviso(
  titulo: string,
  conteudo: string,
  autorNome: string,
  fixado = false,
): Promise<void> {
  if (!supabase) return;
  await supabase.from('avisos').insert({
    titulo,
    conteudo,
    autor_nome: autorNome,
    fixado,
    criado_em: new Date().toISOString(),
  });
}
