import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	email: text('email').notNull(),
	email_verified: integer('email_verified', { mode: 'boolean' }),
	name: text('name'),
	stripe_customer_id: text('stripe_customer_id')
});

export const sessionTable = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at').notNull()
});

export const emailVerificationTokenTable = sqliteTable('email_verification_token', {
	id: text('id').notNull().primaryKey(),
	user_id: text('user_id').notNull(),
	email: text('email').notNull(),
	expires_at: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const signinTable = sqliteTable('signin', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	logged_in_at: integer('logged_in_at', { mode: 'timestamp' }).notNull(),
	ip_address: text('ip_address').notNull(),
	email: text('email').notNull()
});

export const subscriptionTable = sqliteTable('subscription', {
	id: text('id').notNull().primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => userTable.id),
	stripe_subscription_id: text('stripe_subscription_id'),
	stripe_customer_id: text('stripe_customer_id'),
	plan: text('plan').notNull().default('free'), // free | starter | pro
	status: text('status').notNull().default('active'), // active | canceled | past_due
	proposals_used: integer('proposals_used').notNull().default(0),
	period_start: integer('period_start', { mode: 'timestamp' }),
	period_end: integer('period_end', { mode: 'timestamp' }),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const proposalTable = sqliteTable('proposal', {
	id: text('id').notNull().primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => userTable.id),
	title: text('title').notNull(),
	client_name: text('client_name').notNull(),
	client_email: text('client_email'),
	project_description: text('project_description').notNull(),
	project_type: text('project_type').notNull().default('web'), // web | mobile | design | marketing | other
	budget_range: text('budget_range'), // e.g. "$5,000 - $10,000"
	timeline: text('timeline'), // e.g. "6-8 weeks"
	generated_content: text('generated_content'), // JSON string with all sections
	status: text('status').notNull().default('draft'), // draft | sent | accepted | rejected
	share_token: text('share_token').notNull(),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
	updated_at: integer('updated_at', { mode: 'timestamp' })
});
