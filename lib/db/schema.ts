import { pgTable, varchar, text, integer, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['job_seeker', 'employer']);
export const statusEnum = pgEnum('status', ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected']);
export const activityTypeEnum = pgEnum('activity_type', ['sign_in', 'sign_up', 'sign_out', 'update_password', 'update_account', 'delete_account']);

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  role: roleEnum('role').notNull().default('job_seeker'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const companies = pgTable('companies', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  website: varchar('website', { length: 255 }),
  logo: varchar('logo', { length: 255 }),
  industry: varchar('industry', { length: 100 }),
  size: varchar('size', { length: 50 }),
  location: varchar('location', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const jobs = pgTable('jobs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  companyId: integer('company_id').references(() => companies.id),
  location: varchar('location', { length: 255 }),
  type: varchar('type', { length: 50 }).notNull(),
  salary: varchar('salary', { length: 100 }),
  requirements: text('requirements'),
  benefits: text('benefits'),
  postedBy: integer('posted_by').references(() => users.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const applications = pgTable('applications', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => users.id),
  jobId: integer('job_id').references(() => jobs.id),
  status: statusEnum('status').notNull().default('pending'),
  coverLetter: text('cover_letter'),
  resume: varchar('resume', { length: 500 }),
  appliedAt: timestamp('applied_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => users.id),
  action: activityTypeEnum('action').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  metadata: text('metadata'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

export const ActivityType = {
  SIGN_IN: 'sign_in' as const,
  SIGN_UP: 'sign_up' as const,
  SIGN_OUT: 'sign_out' as const,
  UPDATE_PASSWORD: 'update_password' as const,
  UPDATE_ACCOUNT: 'update_account' as const,
  DELETE_ACCOUNT: 'delete_account' as const,
} as const;
