CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`parent_id` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `disclosures` (
	`id` text PRIMARY KEY NOT NULL,
	`market_id` text NOT NULL,
	`locale` text NOT NULL,
	`type` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `markets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`path_prefix` text DEFAULT '' NOT NULL,
	`default_locale` text NOT NULL,
	`currency_code` text NOT NULL,
	`measurement` text NOT NULL,
	`launch_status` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `brands` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`maker` text,
	`has_direct_affiliate` integer,
	`notes` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brands_slug_unique` ON `brands` (`slug`);--> statement-breakpoint
CREATE TABLE `evidence` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text,
	`claim` text NOT NULL,
	`evidence_level` text NOT NULL,
	`source_url` text,
	`attribution` text,
	`verification_status` text DEFAULT 'provisional' NOT NULL,
	`captured_at` integer,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`r2_key` text,
	`media_type` text NOT NULL,
	`source_type` text NOT NULL,
	`rights_basis` text,
	`usage_scope_json` text,
	`market_restrictions` text,
	`is_ai_generated` integer DEFAULT false NOT NULL,
	`is_original_botplanet` integer DEFAULT false NOT NULL,
	`supports_tested_claim` integer DEFAULT false NOT NULL,
	`evidence_id` text,
	`product_id` text,
	`brand_id` text,
	`alt_text` text,
	`status` text DEFAULT 'pending_rights' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`evidence_id`) REFERENCES `evidence`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `product_market_availability` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`market_id` text NOT NULL,
	`availability_status` text NOT NULL,
	`market_variant_model` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`brand_id` text NOT NULL,
	`category_id` text NOT NULL,
	`product_class` text NOT NULL,
	`name` text NOT NULL,
	`model` text,
	`environments` text NOT NULL,
	`cleans` text NOT NULL,
	`power_type` text NOT NULL,
	`price_tier` text NOT NULL,
	`max_pool_length_ft` integer,
	`specs_json` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`primary_media_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `affiliate_programs` (
	`id` text PRIMARY KEY NOT NULL,
	`retailer_id` text,
	`brand_id` text,
	`market_id` text NOT NULL,
	`network` text NOT NULL,
	`status` text DEFAULT 'identified' NOT NULL,
	`cookie_days` integer,
	`commission_type` text,
	`commission_value_bp` integer,
	`email_links_allowed` integer DEFAULT false NOT NULL,
	`program_url` text,
	`verification_status` text DEFAULT 'provisional' NOT NULL,
	`notes` text,
	FOREIGN KEY (`retailer_id`) REFERENCES `retailers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `offer_price_history` (
	`id` text PRIMARY KEY NOT NULL,
	`offer_id` text NOT NULL,
	`price_minor` integer,
	`currency_code` text NOT NULL,
	`stock_status` text,
	`source` text NOT NULL,
	`checked_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `offers` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`retailer_id` text NOT NULL,
	`market_id` text NOT NULL,
	`affiliate_program_id` text,
	`currency_code` text NOT NULL,
	`base_price_minor` integer,
	`delivery_price_minor` integer,
	`total_landed_minor` integer,
	`stock_status` text,
	`delivery_min_days` integer,
	`delivery_max_days` integer,
	`warranty_summary` text,
	`returns_url` text,
	`redirect_key` text,
	`affiliate_destination_url` text,
	`commission_value_bp` integer,
	`source` text DEFAULT 'manual' NOT NULL,
	`freshness_class` text DEFAULT 'indicative' NOT NULL,
	`confidence` text DEFAULT 'low' NOT NULL,
	`price_verification` text DEFAULT 'snapshot' NOT NULL,
	`last_checked_at` integer,
	`seller_identity` text,
	`offer_status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`retailer_id`) REFERENCES `retailers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`affiliate_program_id`) REFERENCES `affiliate_programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `offers_redirect_key_unique` ON `offers` (`redirect_key`);--> statement-breakpoint
CREATE TABLE `redirect_links` (
	`key` text PRIMARY KEY NOT NULL,
	`offer_id` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `retailer_markets` (
	`id` text PRIMARY KEY NOT NULL,
	`retailer_id` text NOT NULL,
	`market_id` text NOT NULL,
	`approved` integer DEFAULT false NOT NULL,
	`ships_to_json` text,
	FOREIGN KEY (`retailer_id`) REFERENCES `retailers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `retailers` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`approval_status` text DEFAULT 'unreviewed' NOT NULL,
	`reliability_score` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `retailers_slug_unique` ON `retailers` (`slug`);--> statement-breakpoint
CREATE TABLE `questionnaires` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`version` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`schema_json` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `scoring_configs` (
	`id` text PRIMARY KEY NOT NULL,
	`questionnaire_id` text NOT NULL,
	`version` integer NOT NULL,
	`weights_json` text NOT NULL,
	`hard_exclusions_json` text NOT NULL,
	`class_eligibility_json` text NOT NULL,
	`tiebreak_tolerances_json` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	FOREIGN KEY (`questionnaire_id`) REFERENCES `questionnaires`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`entity` text NOT NULL,
	`entity_id` text NOT NULL,
	`action` text NOT NULL,
	`actor` text NOT NULL,
	`before_json` text,
	`after_json` text,
	`at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text,
	`product_id` text,
	`market_id` text NOT NULL,
	`type` text NOT NULL,
	`contact_json` text,
	`status` text DEFAULT 'new' NOT NULL,
	`routed_to` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recommendation_scores` (
	`id` text PRIMARY KEY NOT NULL,
	`recommendation_id` text NOT NULL,
	`product_id` text NOT NULL,
	`suitability_score` integer NOT NULL,
	`breakdown_json` text,
	`excluded` integer DEFAULT false NOT NULL,
	`exclusion_reason` text,
	FOREIGN KEY (`recommendation_id`) REFERENCES `recommendations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recommendations` (
	`id` text PRIMARY KEY NOT NULL,
	`secure_token` text NOT NULL,
	`market_id` text NOT NULL,
	`locale` text NOT NULL,
	`questionnaire_version` integer NOT NULL,
	`scoring_config_version` integer NOT NULL,
	`inputs_json` text NOT NULL,
	`chosen_product_id` text,
	`chosen_offer_id` text,
	`explanation_json` text,
	`email` text,
	`consent_json` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`expires_at` integer,
	FOREIGN KEY (`market_id`) REFERENCES `markets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`chosen_product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`chosen_offer_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recommendations_secure_token_unique` ON `recommendations` (`secure_token`);