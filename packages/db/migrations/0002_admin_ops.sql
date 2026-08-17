ALTER TABLE `affiliate_programs` ADD `terms_source` text;--> statement-breakpoint
ALTER TABLE `affiliate_programs` ADD `product_feed_available` integer;--> statement-breakpoint
ALTER TABLE `affiliate_programs` ADD `api_available` integer;--> statement-breakpoint
ALTER TABLE `affiliate_programs` ADD `stock_feed_available` integer;--> statement-breakpoint
ALTER TABLE `affiliate_programs` ADD `shipping_data_available` integer;--> statement-breakpoint
ALTER TABLE `affiliate_programs` ADD `image_permission` text;--> statement-breakpoint
ALTER TABLE `affiliate_accounts` ADD `current_blocker` text;--> statement-breakpoint
ALTER TABLE `affiliate_accounts` ADD `next_action` text;--> statement-breakpoint
ALTER TABLE `affiliate_accounts` ADD `follow_up_date` integer;