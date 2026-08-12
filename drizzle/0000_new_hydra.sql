CREATE TABLE "campanhas" (
	"id" text PRIMARY KEY NOT NULL,
	"igreja_id" text NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text NOT NULL,
	"meta" real NOT NULL,
	"prazo" text NOT NULL,
	"imagem_emoji" text DEFAULT '🙏' NOT NULL,
	"encerrada" boolean DEFAULT false NOT NULL,
	"criada_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comunicados_mural" (
	"id" text PRIMARY KEY NOT NULL,
	"igreja_id" text NOT NULL,
	"titulo" text NOT NULL,
	"corpo" text NOT NULL,
	"emoji" text NOT NULL,
	"publicado_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contribuicoes" (
	"id" text PRIMARY KEY NOT NULL,
	"igreja_id" text NOT NULL,
	"fiel_id" text NOT NULL,
	"tipo" text NOT NULL,
	"campanha_id" text,
	"meio" text NOT NULL,
	"valor_bruto" real NOT NULL,
	"taxa_percentual" real NOT NULL,
	"taxa_valor" real NOT NULL,
	"valor_total_fiel" real NOT NULL,
	"taxa_cobrada_via" text NOT NULL,
	"status" text DEFAULT 'aguardando_pix' NOT NULL,
	"criada_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" text PRIMARY KEY NOT NULL,
	"igreja_id" text NOT NULL,
	"titulo" text NOT NULL,
	"data" text NOT NULL,
	"local" text NOT NULL,
	"descricao" text NOT NULL,
	"arrecadacao_vinculada" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fieis" (
	"id" text PRIMARY KEY NOT NULL,
	"igreja_id" text NOT NULL,
	"nome" text NOT NULL,
	"telefone" text NOT NULL,
	"criado_em" text NOT NULL,
	"cartao_bandeira" text,
	"cartao_ultimos_digitos" text,
	"cartao_token_fake" text
);
--> statement-breakpoint
CREATE TABLE "igrejas" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nome" text NOT NULL,
	"cnpj" text NOT NULL,
	"responsavel_nome" text NOT NULL,
	"responsavel_email" text NOT NULL,
	"responsavel_whatsapp" text NOT NULL,
	"cidade" text NOT NULL,
	"uf" text NOT NULL,
	"logo_emoji" text DEFAULT '⛪' NOT NULL,
	"foto_url" text,
	"status_onboarding" text DEFAULT 'em_analise' NOT NULL,
	"chave_pix" text NOT NULL,
	"criada_em" text NOT NULL,
	CONSTRAINT "igrejas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "links_extras" (
	"id" text PRIMARY KEY NOT NULL,
	"igreja_id" text NOT NULL,
	"rotulo" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "links_pagamento" (
	"id" text PRIMARY KEY NOT NULL,
	"igreja_id" text NOT NULL,
	"titulo" text NOT NULL,
	"tipo" text NOT NULL,
	"valor_sugerido" real,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notificacoes_fiel" (
	"id" text PRIMARY KEY NOT NULL,
	"fiel_id" text NOT NULL,
	"igreja_id" text NOT NULL,
	"tipo" text NOT NULL,
	"titulo" text NOT NULL,
	"corpo" text NOT NULL,
	"lida" boolean DEFAULT false NOT NULL,
	"criada_em" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios_igreja" (
	"id" text PRIMARY KEY NOT NULL,
	"igreja_id" text NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"papel" text NOT NULL,
	CONSTRAINT "usuarios_igreja_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "campanhas" ADD CONSTRAINT "campanhas_igreja_id_igrejas_id_fk" FOREIGN KEY ("igreja_id") REFERENCES "public"."igrejas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comunicados_mural" ADD CONSTRAINT "comunicados_mural_igreja_id_igrejas_id_fk" FOREIGN KEY ("igreja_id") REFERENCES "public"."igrejas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contribuicoes" ADD CONSTRAINT "contribuicoes_igreja_id_igrejas_id_fk" FOREIGN KEY ("igreja_id") REFERENCES "public"."igrejas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contribuicoes" ADD CONSTRAINT "contribuicoes_fiel_id_fieis_id_fk" FOREIGN KEY ("fiel_id") REFERENCES "public"."fieis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contribuicoes" ADD CONSTRAINT "contribuicoes_campanha_id_campanhas_id_fk" FOREIGN KEY ("campanha_id") REFERENCES "public"."campanhas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_igreja_id_igrejas_id_fk" FOREIGN KEY ("igreja_id") REFERENCES "public"."igrejas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fieis" ADD CONSTRAINT "fieis_igreja_id_igrejas_id_fk" FOREIGN KEY ("igreja_id") REFERENCES "public"."igrejas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links_extras" ADD CONSTRAINT "links_extras_igreja_id_igrejas_id_fk" FOREIGN KEY ("igreja_id") REFERENCES "public"."igrejas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links_pagamento" ADD CONSTRAINT "links_pagamento_igreja_id_igrejas_id_fk" FOREIGN KEY ("igreja_id") REFERENCES "public"."igrejas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificacoes_fiel" ADD CONSTRAINT "notificacoes_fiel_fiel_id_fieis_id_fk" FOREIGN KEY ("fiel_id") REFERENCES "public"."fieis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificacoes_fiel" ADD CONSTRAINT "notificacoes_fiel_igreja_id_igrejas_id_fk" FOREIGN KEY ("igreja_id") REFERENCES "public"."igrejas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios_igreja" ADD CONSTRAINT "usuarios_igreja_igreja_id_igrejas_id_fk" FOREIGN KEY ("igreja_id") REFERENCES "public"."igrejas"("id") ON DELETE cascade ON UPDATE no action;