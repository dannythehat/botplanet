CREATE TABLE `affiliate_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`affiliate_program_id` text,
	`network` text NOT NULL,
	`market_id` text NOT NULL,
	`application_stage` text DEFAULT 'identified' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`application_date` integer,
	`decision_date` integer,
	`external_account_ref` text,
	`commission_structure_json` text,
	`commission_effective_from` integer,
	`cookie_days` integer,
	`payment_threshold_minor` integer,
	`payment_cadence` text,
	`payment_method_label` text,
	`claim_instructions` text,
	`next_expected_payment_at` integer,
	`account_manager_contact` text,
	`program_terms_url` text,
	`creative_permissions` text,
	`coverage_notes` text,
	`last_terms_verified_at` integer,
	`suspension_status` text,
	`tax_bank_identity_setup_status` text DEFAULT 'incomplete' NOT NULL,
	`secret_ref` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`affiliate_program_id`) REFERENCES `affiliate_programs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `aa_market_idx` ON `affiliate_accounts` (`market_id`);--> statement-breakpoint
CREATE INDEX `aa_program_idx` ON `affiliate_accounts` (`affiliate_program_id`);--> statement-breakpoint
CREATE TABLE `click_events` (
	`id` text PRIMARY KEY NOT NULL,
	`occurred_at` integer DEFAULT (unixepoch()) NOT NULL,
	`session_anon_id` text,
	`market_id` text,
	`product_id` text,
	`offer_id` text,
	`retailer_id` text,
	`affiliate_program_id` text,
	`redirect_key` text,
	`destination_version` text,
	`source_page` text,
	`page_type` text,
	`content_cluster` text,
	`placement` text,
	`recommendation_module` text,
	`recommendation_id` text,
	`campaign` text,
	`traffic_source` text,
	`device_class` text,
	`consent_state` text,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`retailer_id`) REFERENCES `retailers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`affiliate_program_id`) REFERENCES `affiliate_programs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recommendation_id`) REFERENCES `recommendations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `ce_offer_idx` ON `click_events` (`offer_id`);--> statement-breakpoint
CREATE INDEX `ce_reco_idx` ON `click_events` (`recommendation_id`);--> statement-breakpoint
CREATE INDEX `ce_market_time_idx` ON `click_events` (`market_id`,`occurred_at`);--> statement-breakpoint
CREATE INDEX `ce_redirect_idx` ON `click_events` (`redirect_key`);--> statement-breakpoint
CREATE TABLE `commission_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`external_transaction_id` text NOT NULL,
	`network` text NOT NULL,
	`affiliate_program_id` text,
	`click_correlation_id` text,
	`click_event_id` text,
	`product_id` text,
	`offer_id` text,
	`source_page` text,
	`page_type` text,
	`recommendation_id` text,
	`campaign` text,
	`traffic_source` text,
	`market_id` text,
	`order_value_minor` integer,
	`currency_code` text NOT NULL,
	`estimated_commission_minor` integer,
	`confirmed_commission_minor` integer,
	`state` text DEFAULT 'pending' NOT NULL,
	`conversion_date` integer,
	`validation_date` integer,
	`expected_payment_date` integer,
	`actual_payment_date` integer,
	`reversal_reason` text,
	`import_source` text,
	`import_job_id` text,
	`reconciliation_confidence` text,
	`manual_adjustment_minor` integer,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`affiliate_program_id`) REFERENCES `affiliate_programs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`click_event_id`) REFERENCES `click_events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recommendation_id`) REFERENCES `recommendations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ct_network_txn_uq` ON `commission_transactions` (`network`,`external_transaction_id`);--> statement-breakpoint
CREATE INDEX `ct_program_idx` ON `commission_transactions` (`affiliate_program_id`);--> statement-breakpoint
CREATE INDEX `ct_click_idx` ON `commission_transactions` (`click_event_id`);--> statement-breakpoint
CREATE INDEX `ct_state_idx` ON `commission_transactions` (`state`);--> statement-breakpoint
CREATE TABLE `import_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`network` text,
	`started_at` integer DEFAULT (unixepoch()) NOT NULL,
	`finished_at` integer,
	`status` text DEFAULT 'running' NOT NULL,
	`rows_imported` integer DEFAULT 0 NOT NULL,
	`provenance_json` text,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `payouts` (
	`id` text PRIMARY KEY NOT NULL,
	`affiliate_account_id` text,
	`network` text NOT NULL,
	`market_id` text,
	`amount_minor` integer NOT NULL,
	`currency_code` text NOT NULL,
	`period_start` integer,
	`period_end` integer,
	`status` text DEFAULT 'expected' NOT NULL,
	`paid_at` integer,
	`method` text,
	`reference` text,
	`notes` text,
	FOREIGN KEY (`affiliate_account_id`) REFERENCES `affiliate_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `po_account_idx` ON `payouts` (`affiliate_account_id`);--> statement-breakpoint
CREATE TABLE `program_terms_history` (
	`id` text PRIMARY KEY NOT NULL,
	`affiliate_program_id` text NOT NULL,
	`verified_at` integer DEFAULT (unixepoch()) NOT NULL,
	`terms_url` text,
	`commission_snapshot_json` text,
	`cookie_days_snapshot` integer,
	`change_note` text,
	FOREIGN KEY (`affiliate_program_id`) REFERENCES `affiliate_programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `pth_program_idx` ON `program_terms_history` (`affiliate_program_id`);--> statement-breakpoint
CREATE TABLE `revenue_daily` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`market_id` text,
	`category_id` text,
	`brand_id` text,
	`product_id` text,
	`retailer_id` text,
	`affiliate_program_id` text,
	`clicks` integer DEFAULT 0 NOT NULL,
	`conversions` integer DEFAULT 0 NOT NULL,
	`estimated_commission_minor` integer DEFAULT 0 NOT NULL,
	`confirmed_commission_minor` integer DEFAULT 0 NOT NULL,
	`currency_code` text NOT NULL,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`retailer_id`) REFERENCES `retailers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`affiliate_program_id`) REFERENCES `affiliate_programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rd_dimensions_uq` ON `revenue_daily` (`date`,`market_id`,`product_id`,`retailer_id`,`affiliate_program_id`);--> statement-breakpoint
CREATE INDEX `rd_date_idx` ON `revenue_daily` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `pma_product_market_uq` ON `product_market_availability` (`product_id`,`market_id`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `products_brand_idx` ON `products` (`brand_id`);--> statement-breakpoint
CREATE INDEX `ap_market_idx` ON `affiliate_programs` (`market_id`);--> statement-breakpoint
CREATE INDEX `ap_retailer_idx` ON `affiliate_programs` (`retailer_id`);--> statement-breakpoint
CREATE INDEX `ap_brand_idx` ON `affiliate_programs` (`brand_id`);--> statement-breakpoint
CREATE INDEX `oph_offer_idx` ON `offer_price_history` (`offer_id`);--> statement-breakpoint
CREATE INDEX `offers_product_market_idx` ON `offers` (`product_id`,`market_id`);--> statement-breakpoint
CREATE INDEX `offers_market_idx` ON `offers` (`market_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `rm_retailer_market_uq` ON `retailer_markets` (`retailer_id`,`market_id`);--> statement-breakpoint
CREATE INDEX `rs_reco_idx` ON `recommendation_scores` (`recommendation_id`);