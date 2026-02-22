CREATE TABLE `proposal` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`client_name` text NOT NULL,
	`client_email` text,
	`project_description` text NOT NULL,
	`project_type` text DEFAULT 'web' NOT NULL,
	`budget_range` text,
	`timeline` text,
	`generated_content` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`share_token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`stripe_subscription_id` text,
	`stripe_customer_id` text,
	`plan` text DEFAULT 'free' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`proposals_used` integer DEFAULT 0 NOT NULL,
	`period_start` integer,
	`period_end` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `user` ADD `name` text;--> statement-breakpoint
ALTER TABLE `user` ADD `stripe_customer_id` text;