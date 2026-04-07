CREATE TYPE "papel_usuario" AS ENUM (
  'professor',
  'diretor',
  'coordenador',
  'vice_diretor',
  'secretario',
  'administrador'
);

CREATE TYPE "status_usuario" AS ENUM (
  'ativo',
  'inativo',
  'bloqueado',
  'pendente'
);

CREATE TYPE "tipo_turma" AS ENUM (
  'fundamental',
  'medio',
  'tecnico',
  'outro'
);

CREATE TYPE "categoria_evento" AS ENUM (
  'aula',
  'reuniao',
  'avaliacao',
  'planejamento',
  'tutoria',
  'pais',
  'institucional',
  'conselho_classe',
  'formacao',
  'apoio_presencial',
  'pausa',
  'outro'
);

CREATE TYPE "status_evento" AS ENUM (
  'rascunho',
  'agendado',
  'confirmado',
  'cancelado',
  'concluido'
);

CREATE TYPE "tipo_recorrencia" AS ENUM (
  'nenhuma',
  'semanal',
  'quinzenal',
  'mensal'
);

CREATE TYPE "status_plano_aula" AS ENUM (
  'rascunho',
  'enviado',
  'em_validacao',
  'aprovado',
  'rejeitado',
  'revisao_solicitada'
);

CREATE TYPE "tipo_notificacao" AS ENUM (
  'reuniao',
  'evento',
  'validacao',
  'atualizacao',
  'lembrete',
  'sistema'
);

CREATE TYPE "prioridade_notificacao" AS ENUM (
  'baixa',
  'media',
  'alta'
);

CREATE TYPE "canal_notificacao" AS ENUM (
  'interna',
  'email',
  'push',
  'whatsapp'
);

CREATE TYPE "status_validacao" AS ENUM (
  'pendente',
  'aprovado',
  'rejeitado'
);

CREATE TYPE "tipo_destinatario" AS ENUM (
  'usuario',
  'papel',
  'turma',
  'todos'
);

CREATE TABLE "escolas" (
  "id" uuid PRIMARY KEY,
  "nome" varchar(200) NOT NULL,
  "sigla" varchar(50),
  "cnpj" varchar(20),
  "ano_letivo" integer,
  "timezone" varchar(60) DEFAULT 'America/Sao_Paulo',
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "usuarios" (
  "id" uuid PRIMARY KEY,
  "escola_id" uuid NOT NULL,
  "nome" varchar(200) NOT NULL,
  "email" varchar(200) UNIQUE NOT NULL,
  "senha_hash" varchar(255) NOT NULL,
  "papel" papel_usuario NOT NULL,
  "status" status_usuario NOT NULL DEFAULT 'ativo',
  "telefone" varchar(30),
  "foto_url" varchar(255),
  "ultimo_acesso_em" timestamp,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "perfis_profissionais" (
  "id" uuid PRIMARY KEY,
  "usuario_id" uuid UNIQUE NOT NULL,
  "codigo_funcional" varchar(50),
  "cargo" varchar(100),
  "observacoes" text
);

CREATE TABLE "disciplinas" (
  "id" uuid PRIMARY KEY,
  "escola_id" uuid NOT NULL,
  "nome" varchar(120) NOT NULL,
  "area_conhecimento" varchar(120),
  "cor_hex" varchar(7),
  "ativo" boolean NOT NULL DEFAULT true
);

CREATE TABLE "turmas" (
  "id" uuid PRIMARY KEY,
  "escola_id" uuid NOT NULL,
  "codigo" varchar(50) NOT NULL,
  "nome_exibicao" varchar(100) NOT NULL,
  "tipo" tipo_turma NOT NULL,
  "serie_ano" varchar(50),
  "turno" varchar(30),
  "sala_base" varchar(80),
  "ativo" boolean NOT NULL DEFAULT true
);

CREATE TABLE "salas" (
  "id" uuid PRIMARY KEY,
  "escola_id" uuid NOT NULL,
  "nome" varchar(120) NOT NULL,
  "bloco" varchar(50),
  "capacidade" integer,
  "tipo" varchar(50),
  "ativa" boolean NOT NULL DEFAULT true
);

CREATE TABLE "professor_turma_disciplina" (
  "id" uuid PRIMARY KEY,
  "professor_id" uuid NOT NULL,
  "turma_id" uuid NOT NULL,
  "disciplina_id" uuid NOT NULL,
  "ano_letivo" integer NOT NULL,
  "ativo" boolean NOT NULL DEFAULT true
);

CREATE TABLE "calendarios" (
  "id" uuid PRIMARY KEY,
  "escola_id" uuid NOT NULL,
  "nome" varchar(150) NOT NULL,
  "tipo" varchar(30) NOT NULL,
  "proprietario_usuario_id" uuid,
  "descricao" text,
  "cor_hex" varchar(7),
  "ativo" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "faixas_horario" (
  "id" uuid PRIMARY KEY,
  "escola_id" uuid NOT NULL,
  "nome" varchar(80),
  "ordem" integer NOT NULL,
  "hora_inicio" time NOT NULL,
  "hora_fim" time NOT NULL,
  "tipo" varchar(30) NOT NULL,
  "ativo" boolean NOT NULL DEFAULT true
);

CREATE TABLE "eventos" (
  "id" uuid PRIMARY KEY,
  "calendario_id" uuid NOT NULL,
  "criado_por_usuario_id" uuid NOT NULL,
  "responsavel_usuario_id" uuid,
  "disciplina_id" uuid,
  "turma_id" uuid,
  "sala_id" uuid,
  "faixa_horario_id" uuid,
  "titulo" varchar(200) NOT NULL,
  "descricao" text,
  "categoria" categoria_evento NOT NULL,
  "status" status_evento NOT NULL DEFAULT 'agendado',
  "data_inicio" timestamp NOT NULL,
  "data_fim" timestamp NOT NULL,
  "dia_inteiro" boolean NOT NULL DEFAULT false,
  "recorrencia_tipo" tipo_recorrencia NOT NULL DEFAULT 'nenhuma',
  "recorrencia_intervalo" integer NOT NULL DEFAULT 1,
  "recorrencia_fim_em" date,
  "origem" varchar(30),
  "evento_pai_id" uuid,
  "criado_em" timestamp NOT NULL,
  "atualizado_em" timestamp NOT NULL
);

CREATE TABLE "evento_participantes" (
  "id" uuid PRIMARY KEY,
  "evento_id" uuid NOT NULL,
  "usuario_id" uuid,
  "turma_id" uuid,
  "nome_livre" varchar(200),
  "tipo_participante" varchar(50),
  "confirmou_presenca" boolean
);

CREATE TABLE "eventos_excecao" (
  "id" uuid PRIMARY KEY,
  "evento_id" uuid NOT NULL,
  "data_referencia" date NOT NULL,
  "acao" varchar(30) NOT NULL,
  "novo_inicio" timestamp,
  "novo_fim" timestamp,
  "observacao" text
);

CREATE TABLE "calendario_excecoes" (
  "id" uuid PRIMARY KEY,
  "escola_id" uuid NOT NULL,
  "titulo" varchar(150) NOT NULL,
  "descricao" text,
  "tipo" varchar(30) NOT NULL,
  "data_inicio" date NOT NULL,
  "data_fim" date,
  "impacta_todas_agendas" boolean NOT NULL DEFAULT true,
  "criado_por_usuario_id" uuid
);

CREATE TABLE "planos_aula" (
  "id" uuid PRIMARY KEY,
  "professor_id" uuid NOT NULL,
  "turma_id" uuid NOT NULL,
  "disciplina_id" uuid NOT NULL,
  "evento_id" uuid,
  "titulo" varchar(200) NOT NULL,
  "competencia" text,
  "habilidade" text,
  "objetivo" text,
  "conteudo" text,
  "metodologia" text,
  "avaliacao" text,
  "observacoes" text,
  "status" status_plano_aula NOT NULL DEFAULT 'rascunho',
  "referencia_data" date,
  "enviado_em" timestamp,
  "atualizado_em" timestamp NOT NULL,
  "criado_em" timestamp NOT NULL
);

CREATE TABLE "anexos" (
  "id" uuid PRIMARY KEY,
  "escola_id" uuid NOT NULL,
  "uploader_usuario_id" uuid NOT NULL,
  "nome_arquivo" varchar(255) NOT NULL,
  "mime_type" varchar(100),
  "tamanho_bytes" bigint,
  "storage_path" varchar(255) NOT NULL,
  "url_publica" varchar(255),
  "criado_em" timestamp NOT NULL
);

CREATE TABLE "plano_aula_anexos" (
  "id" uuid PRIMARY KEY,
  "plano_aula_id" uuid NOT NULL,
  "anexo_id" uuid NOT NULL
);

CREATE TABLE "validacoes_plano_aula" (
  "id" uuid PRIMARY KEY,
  "plano_aula_id" uuid NOT NULL,
  "avaliador_usuario_id" uuid NOT NULL,
  "status" status_validacao NOT NULL,
  "parecer" text,
  "criado_em" timestamp NOT NULL
);

CREATE TABLE "notificacoes" (
  "id" uuid PRIMARY KEY,
  "escola_id" uuid NOT NULL,
  "tipo" tipo_notificacao NOT NULL,
  "prioridade" prioridade_notificacao NOT NULL DEFAULT 'media',
  "titulo" varchar(200) NOT NULL,
  "descricao" text NOT NULL,
  "referencia_tipo" varchar(50),
  "referencia_id" uuid,
  "action_label" varchar(80),
  "action_url" varchar(255),
  "criada_em" timestamp NOT NULL
);

CREATE TABLE "notificacao_destinatarios" (
  "id" uuid PRIMARY KEY,
  "notificacao_id" uuid NOT NULL,
  "usuario_id" uuid,
  "papel" papel_usuario,
  "turma_id" uuid,
  "tipo_destinatario" tipo_destinatario NOT NULL,
  "lida_em" timestamp,
  "enviada_em" timestamp,
  "canal" canal_notificacao NOT NULL DEFAULT 'interna'
);

CREATE TABLE "metricas_dashboard" (
  "id" uuid PRIMARY KEY,
  "escola_id" uuid NOT NULL,
  "data_referencia" date NOT NULL,
  "eventos_agendados" integer NOT NULL DEFAULT 0,
  "eventos_concluidos" integer NOT NULL DEFAULT 0,
  "planos_pendentes" integer NOT NULL DEFAULT 0,
  "notificacoes_nao_lidas" integer NOT NULL DEFAULT 0,
  "conflitos_horario" integer NOT NULL DEFAULT 0,
  "atualizado_em" timestamp NOT NULL
);

CREATE TABLE "configuracoes_notificacao" (
  "id" uuid PRIMARY KEY,
  "usuario_id" uuid NOT NULL,
  "recebe_email" boolean NOT NULL DEFAULT true,
  "recebe_push" boolean NOT NULL DEFAULT true,
  "recebe_whatsapp" boolean NOT NULL DEFAULT false,
  "antecedencia_lembrete_minutos" integer NOT NULL DEFAULT 30
);

CREATE TABLE "auditoria" (
  "id" uuid PRIMARY KEY,
  "escola_id" uuid NOT NULL,
  "usuario_id" uuid,
  "entidade" varchar(80) NOT NULL,
  "entidade_id" uuid NOT NULL,
  "acao" varchar(50) NOT NULL,
  "antes" json,
  "depois" json,
  "criado_em" timestamp NOT NULL
);

COMMENT ON COLUMN "calendarios"."tipo" IS 'institucional, professor, direcao, coordenacao';

COMMENT ON COLUMN "faixas_horario"."tipo" IS 'aula, intervalo, almoco, reuniao';

COMMENT ON COLUMN "eventos"."origem" IS 'manual, importacao, sistema';

COMMENT ON COLUMN "evento_participantes"."tipo_participante" IS 'organizador, convidado, turma, externo';

COMMENT ON COLUMN "eventos_excecao"."acao" IS 'cancelar, mover, sobrescrever';

COMMENT ON COLUMN "calendario_excecoes"."tipo" IS 'feriado, ferias, recesso, ponto_facultativo';

COMMENT ON COLUMN "notificacoes"."referencia_tipo" IS 'evento, plano_aula, validacao, sistema';

ALTER TABLE "usuarios" ADD FOREIGN KEY ("escola_id") REFERENCES "escolas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "perfis_profissionais" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "disciplinas" ADD FOREIGN KEY ("escola_id") REFERENCES "escolas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "turmas" ADD FOREIGN KEY ("escola_id") REFERENCES "escolas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "salas" ADD FOREIGN KEY ("escola_id") REFERENCES "escolas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "professor_turma_disciplina" ADD FOREIGN KEY ("professor_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "professor_turma_disciplina" ADD FOREIGN KEY ("turma_id") REFERENCES "turmas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "professor_turma_disciplina" ADD FOREIGN KEY ("disciplina_id") REFERENCES "disciplinas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "calendarios" ADD FOREIGN KEY ("escola_id") REFERENCES "escolas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "calendarios" ADD FOREIGN KEY ("proprietario_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "faixas_horario" ADD FOREIGN KEY ("escola_id") REFERENCES "escolas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "eventos" ADD FOREIGN KEY ("calendario_id") REFERENCES "calendarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "eventos" ADD FOREIGN KEY ("criado_por_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "eventos" ADD FOREIGN KEY ("responsavel_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "eventos" ADD FOREIGN KEY ("disciplina_id") REFERENCES "disciplinas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "eventos" ADD FOREIGN KEY ("turma_id") REFERENCES "turmas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "eventos" ADD FOREIGN KEY ("sala_id") REFERENCES "salas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "eventos" ADD FOREIGN KEY ("faixa_horario_id") REFERENCES "faixas_horario" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "eventos" ADD FOREIGN KEY ("evento_pai_id") REFERENCES "eventos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_participantes" ADD FOREIGN KEY ("evento_id") REFERENCES "eventos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_participantes" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "evento_participantes" ADD FOREIGN KEY ("turma_id") REFERENCES "turmas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "eventos_excecao" ADD FOREIGN KEY ("evento_id") REFERENCES "eventos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "calendario_excecoes" ADD FOREIGN KEY ("escola_id") REFERENCES "escolas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "calendario_excecoes" ADD FOREIGN KEY ("criado_por_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "planos_aula" ADD FOREIGN KEY ("professor_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "planos_aula" ADD FOREIGN KEY ("turma_id") REFERENCES "turmas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "planos_aula" ADD FOREIGN KEY ("disciplina_id") REFERENCES "disciplinas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "planos_aula" ADD FOREIGN KEY ("evento_id") REFERENCES "eventos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "anexos" ADD FOREIGN KEY ("escola_id") REFERENCES "escolas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "anexos" ADD FOREIGN KEY ("uploader_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "plano_aula_anexos" ADD FOREIGN KEY ("plano_aula_id") REFERENCES "planos_aula" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "plano_aula_anexos" ADD FOREIGN KEY ("anexo_id") REFERENCES "anexos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "validacoes_plano_aula" ADD FOREIGN KEY ("plano_aula_id") REFERENCES "planos_aula" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "validacoes_plano_aula" ADD FOREIGN KEY ("avaliador_usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificacoes" ADD FOREIGN KEY ("escola_id") REFERENCES "escolas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificacao_destinatarios" ADD FOREIGN KEY ("notificacao_id") REFERENCES "notificacoes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificacao_destinatarios" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificacao_destinatarios" ADD FOREIGN KEY ("turma_id") REFERENCES "turmas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "metricas_dashboard" ADD FOREIGN KEY ("escola_id") REFERENCES "escolas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "configuracoes_notificacao" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "auditoria" ADD FOREIGN KEY ("escola_id") REFERENCES "escolas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "auditoria" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;
