CREATE TABLE `campanhas` (
	`id` text PRIMARY KEY NOT NULL,
	`igreja_id` text NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text NOT NULL,
	`meta` real NOT NULL,
	`prazo` text NOT NULL,
	`imagem_emoji` text DEFAULT '🙏' NOT NULL,
	`encerrada` integer DEFAULT false NOT NULL,
	`criada_em` text NOT NULL,
	FOREIGN KEY (`igreja_id`) REFERENCES `igrejas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `comunicados_mural` (
	`id` text PRIMARY KEY NOT NULL,
	`igreja_id` text NOT NULL,
	`titulo` text NOT NULL,
	`corpo` text NOT NULL,
	`emoji` text NOT NULL,
	`publicado_em` text NOT NULL,
	FOREIGN KEY (`igreja_id`) REFERENCES `igrejas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contribuicoes` (
	`id` text PRIMARY KEY NOT NULL,
	`igreja_id` text NOT NULL,
	`fiel_id` text NOT NULL,
	`tipo` text NOT NULL,
	`campanha_id` text,
	`meio` text NOT NULL,
	`valor_bruto` real NOT NULL,
	`taxa_percentual` real NOT NULL,
	`taxa_valor` real NOT NULL,
	`valor_total_fiel` real NOT NULL,
	`taxa_cobrada_via` text NOT NULL,
	`status` text DEFAULT 'aguardando_pix' NOT NULL,
	`criada_em` text NOT NULL,
	FOREIGN KEY (`igreja_id`) REFERENCES `igrejas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`fiel_id`) REFERENCES `fieis`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`campanha_id`) REFERENCES `campanhas`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `eventos` (
	`id` text PRIMARY KEY NOT NULL,
	`igreja_id` text NOT NULL,
	`titulo` text NOT NULL,
	`data` text NOT NULL,
	`local` text NOT NULL,
	`descricao` text NOT NULL,
	`arrecadacao_vinculada` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`igreja_id`) REFERENCES `igrejas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `fieis` (
	`id` text PRIMARY KEY NOT NULL,
	`igreja_id` text NOT NULL,
	`nome` text NOT NULL,
	`telefone` text NOT NULL,
	`criado_em` text NOT NULL,
	`cartao_bandeira` text,
	`cartao_ultimos_digitos` text,
	`cartao_token_fake` text,
	FOREIGN KEY (`igreja_id`) REFERENCES `igrejas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `igrejas` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`nome` text NOT NULL,
	`cnpj` text NOT NULL,
	`responsavel_nome` text NOT NULL,
	`responsavel_email` text NOT NULL,
	`responsavel_whatsapp` text NOT NULL,
	`cidade` text NOT NULL,
	`uf` text NOT NULL,
	`logo_emoji` text DEFAULT '⛪' NOT NULL,
	`foto_url` text,
	`status_onboarding` text DEFAULT 'em_analise' NOT NULL,
	`chave_pix` text NOT NULL,
	`criada_em` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `igrejas_slug_unique` ON `igrejas` (`slug`);--> statement-breakpoint
CREATE TABLE `links_extras` (
	`id` text PRIMARY KEY NOT NULL,
	`igreja_id` text NOT NULL,
	`rotulo` text NOT NULL,
	`url` text NOT NULL,
	FOREIGN KEY (`igreja_id`) REFERENCES `igrejas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `links_pagamento` (
	`id` text PRIMARY KEY NOT NULL,
	`igreja_id` text NOT NULL,
	`titulo` text NOT NULL,
	`tipo` text NOT NULL,
	`valor_sugerido` real,
	`ativo` integer DEFAULT true NOT NULL,
	`criado_em` text NOT NULL,
	FOREIGN KEY (`igreja_id`) REFERENCES `igrejas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `notificacoes_fiel` (
	`id` text PRIMARY KEY NOT NULL,
	`fiel_id` text NOT NULL,
	`igreja_id` text NOT NULL,
	`tipo` text NOT NULL,
	`titulo` text NOT NULL,
	`corpo` text NOT NULL,
	`lida` integer DEFAULT false NOT NULL,
	`criada_em` text NOT NULL,
	FOREIGN KEY (`fiel_id`) REFERENCES `fieis`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`igreja_id`) REFERENCES `igrejas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `usuarios_igreja` (
	`id` text PRIMARY KEY NOT NULL,
	`igreja_id` text NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`papel` text NOT NULL,
	FOREIGN KEY (`igreja_id`) REFERENCES `igrejas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_igreja_email_unique` ON `usuarios_igreja` (`email`);