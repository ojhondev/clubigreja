CREATE TABLE "webmasters" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha_hash" text,
	"nivel" text DEFAULT 'secundario' NOT NULL,
	"pode_gerenciar_pagamentos" boolean DEFAULT false NOT NULL,
	"pode_aprovar_igrejas" boolean DEFAULT false NOT NULL,
	"convite_token" text,
	"convite_expira_em" text,
	"convidado_por_id" text,
	"criado_em" text NOT NULL,
	CONSTRAINT "webmasters_email_unique" UNIQUE("email")
);
