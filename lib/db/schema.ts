import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  decimal,
  json,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['job_seeker', 'employer', 'admin']);
export const jobTypeEnum = pgEnum('job_type', ['full_time', 'part_time', 'contract', 'freelance', 'internship']);
export const experienceLevelEnum = pgEnum('experience_level', ['entry', 'mid', 'senior', 'executive']);
export const workModeEnum = pgEnum('work_mode', ['remote', 'onsite', 'hybrid']);
export const applicationStatusEnum = pgEnum('application_status', ['pending', 'reviewed', 'interview', 'rejected', 'accepted']);
export const jobStatusEnum = pgEnum('job_status', ['draft', 'active', 'paused', 'closed', 'expired']);

// Users table (enhanced for job portal)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull().default('job_seeker'),
  avatar: text('avatar'),
  phone: varchar('phone', { length: 20 }),
  location: varchar('location', { length: 255 }),
  isEmailVerified: boolean('is_email_verified').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Companies table
export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  logo: text('logo'),
  website: varchar('website', { length: 255 }),
  industry: varchar('industry', { length: 100 }),
  size: varchar('size', { length: 50 }),
  location: varchar('location', { length: 255 }),
  foundedYear: integer('founded_year'),
  ownerId: integer('owner_id').references(() => users.id),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Jobs table
export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  requirements: text('requirements'),
  benefits: text('benefits'),
  companyId: integer('company_id').notNull().references(() => companies.id),
  type: jobTypeEnum('type').notNull(),
  experienceLevel: experienceLevelEnum('experience_level').notNull(),
  workMode: workModeEnum('work_mode').notNull(),
  location: varchar('location', { length: 255 }),
  salaryMin: decimal('salary_min', { precision: 10, scale: 2 }),
  salaryMax: decimal('salary_max', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('USD'),
  skills: json('skills').$type<string[]>(),
  status: jobStatusEnum('status').notNull().default('draft'),
  featuredUntil: timestamp('featured_until'),
  applicationDeadline: timestamp('application_deadline'),
  createdById: integer('created_by_id').notNull().references(() => users.id),
  viewCount: integer('view_count').default(0),
  applicationCount: integer('application_count').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User Profiles (for job seekers)
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 255 }),
  summary: text('summary'),
  experience: text('experience'),
  education: json('education').$type<any[]>(),
  skills: json('skills').$type<string[]>(),
  resume: text('resume'), // URL to resume file
  portfolio: text('portfolio'), // URL to portfolio
  linkedinUrl: varchar('linkedin_url', { length: 255 }),
  githubUrl: varchar('github_url', { length: 255 }),
  websiteUrl: varchar('website_url', { length: 255 }),
  expectedSalary: decimal('expected_salary', { precision: 10, scale: 2 }),
  availableFrom: timestamp('available_from'),
  isOpenToWork: boolean('is_open_to_work').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Job Applications
export const jobApplications = pgTable('job_applications', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  userId: integer('user_id').notNull().references(() => users.id),
  coverLetter: text('cover_letter'),
  customResume: text('custom_resume'), // URL to custom resume for this application
  status: applicationStatusEnum('status').notNull().default('pending'),
  appliedAt: timestamp('applied_at').notNull().defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
  reviewedById: integer('reviewed_by_id').references(() => users.id),
  notes: text('notes'), // Internal notes from employer
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Activity Logs (enhanced)
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  action: text('action').notNull(),
  entityType: varchar('entity_type', { length: 50 }), // job, application, profile, etc.
  entityId: integer('entity_id'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
  metadata: json('metadata'), // JSON field for additional data
});

// Saved Jobs
export const savedJobs = pgTable('saved_jobs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Job Views (for analytics)
export const jobViews = pgTable('job_views', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  userId: integer('user_id').references(() => users.id), // null for anonymous views
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  viewedAt: timestamp('viewed_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  ownedCompanies: many(companies),
  createdJobs: many(jobs),
  applications: many(jobApplications),
  savedJobs: many(savedJobs),
  activityLogs: many(activityLogs),
  jobViews: many(jobViews),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, {
    fields: [companies.ownerId],
    references: [users.id],
  }),
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  createdBy: one(users, {
    fields: [jobs.createdById],
    references: [users.id],
  }),
  applications: many(jobApplications),
  savedByUsers: many(savedJobs),
  views: many(jobViews),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobs, {
    fields: [jobApplications.jobId],
    references: [jobs.id],
  }),
  user: one(users, {
    fields: [jobApplications.userId],
    references: [users.id],
  }),
  reviewedBy: one(users, {
    fields: [jobApplications.reviewedById],
    references: [users.id],
  }),
}));

export const savedJobsRelations = relations(savedJobs, ({ one }) => ({
  user: one(users, {
    fields: [savedJobs.userId],
    references: [users.id],
  }),
  job: one(jobs, {
    fields: [savedJobs.jobId],
    references: [jobs.id],
  }),
}));

export const jobViewsRelations = relations(jobViews, ({ one }) => ({
  job: one(jobs, {
    fields: [jobViews.jobId],
    references: [jobs.id],
  }),
  user: one(users, {
    fields: [jobViews.userId],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type SavedJob = typeof savedJobs.$inferSelect;
export type NewSavedJob = typeof savedJobs.$inferInsert;
export type JobView = typeof jobViews.$inferSelect;
export type NewJobView = typeof jobViews.$inferInsert;

// Activity types enum
export enum ActivityType {
  // User activities
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  
  // Job activities
  JOB_CREATED = 'JOB_CREATED',
  JOB_UPDATED = 'JOB_UPDATED',
  JOB_DELETED = 'JOB_DELETED',
  JOB_VIEWED = 'JOB_VIEWED',
  JOB_SAVED = 'JOB_SAVED',
  JOB_UNSAVED = 'JOB_UNSAVED',
  
  // Application activities
  APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED',
  APPLICATION_REVIEWED = 'APPLICATION_REVIEWED',
  APPLICATION_ACCEPTED = 'APPLICATION_ACCEPTED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  
  // Company activities
  COMPANY_CREATED = 'COMPANY_CREATED',
  COMPANY_UPDATED = 'COMPANY_UPDATED',
}