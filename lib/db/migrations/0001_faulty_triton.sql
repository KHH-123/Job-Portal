CREATE TYPE "public"."application_status" AS ENUM('pending', 'reviewed', 'interview', 'rejected', 'accepted');--> statement-breakpoint
CREATE TYPE "public"."experience_level" AS ENUM('entry', 'mid', 'senior', 'executive');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('draft', 'active', 'paused', 'closed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('full_time', 'part_time', 'contract', 'freelance', 'internship');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('job_seeker', 'employer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."work_mode" AS ENUM('remote', 'onsite', 'hybrid');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"logo" text,
	"website" varchar(255),
	"industry" varchar(100),
	"size" varchar(50),
	"location" varchar(255),
	"founded_year" integer,
	"owner_id" integer,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"cover_letter" text,
	"custom_resume" text,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"reviewed_by_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"user_id" integer,
	"ip_address" varchar(45),
	"user_agent" text,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"requirements" text,
	"benefits" text,
	"company_id" integer NOT NULL,
	"type" "job_type" NOT NULL,
	"experience_level" "experience_level" NOT NULL,
	"work_mode" "work_mode" NOT NULL,
	"location" varchar(255),
	"salary_min" numeric(10, 2),
	"salary_max" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'USD',
	"skills" json,
	"status" "job_status" DEFAULT 'draft' NOT NULL,
	"featured_until" timestamp,
	"application_deadline" timestamp,
	"created_by_id" integer NOT NULL,
	"view_count" integer DEFAULT 0,
	"application_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "jobs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "saved_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"job_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(255),
	"summary" text,
	"experience" text,
	"education" json,
	"skills" json,
	"resume" text,
	"portfolio" text,
	"linkedin_url" varchar(255),
	"github_url" varchar(255),
	"website_url" varchar(255),
	"expected_salary" numeric(10, 2),
	"available_from" timestamp,
	"is_open_to_work" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ALTER COLUMN "metadata" SET DATA TYPE json USING metadata::json;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD COLUMN "entity_type" varchar(50);--> statement-breakpoint
ALTER TABLE "activity_logs" ADD COLUMN "entity_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'job_seeker' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_email_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_views" ADD CONSTRAINT "job_views_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_views" ADD CONSTRAINT "job_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;