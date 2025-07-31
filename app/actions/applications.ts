'use server';

import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  jobApplications,
  jobs,
  users,
  companies,
  activityLogs,
  type NewJobApplication,
  type NewActivityLog,
  ActivityType,
} from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function logActivity(
  userId: number,
  type: ActivityType,
  entityType?: string,
  entityId?: number,
  metadata?: any
) {
  const newActivity: NewActivityLog = {
    userId,
    action: type,
    entityType,
    entityId,
    metadata,
    timestamp: new Date(),
  };
  await db.insert(activityLogs).values(newActivity);
}

const submitApplicationSchema = z.object({
  jobId: z.number(),
  coverLetter: z.string().min(10, 'Cover letter must be at least 10 characters').max(2000, 'Cover letter too long'),
  customResume: z.string().optional(),
});

export async function submitJobApplication(formData: FormData) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'job_seeker') {
    throw new Error('Only job seekers can apply for jobs');
  }

  const jobId = parseInt(formData.get('jobId') as string);
  const coverLetter = formData.get('coverLetter') as string;
  const customResume = formData.get('customResume') as string;

  const validation = submitApplicationSchema.safeParse({
    jobId,
    coverLetter,
    customResume,
  });

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }

  const { jobId: validatedJobId, coverLetter: validatedCoverLetter, customResume: validatedCustomResume } = validation.data;

  try {
    // Check if user has already applied for this job
    const existingApplication = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.jobId, validatedJobId),
          eq(jobApplications.userId, user.id)
        )
      )
      .limit(1);

    if (existingApplication.length > 0) {
      throw new Error('You have already applied for this job');
    }

    // Get job details for logging
    const job = await db
      .select({ id: jobs.id, title: jobs.title, companyId: jobs.companyId })
      .from(jobs)
      .where(eq(jobs.id, validatedJobId))
      .limit(1);

    if (job.length === 0) {
      throw new Error('Job not found');
    }

    // Create the application
    const newApplication: NewJobApplication = {
      jobId: validatedJobId,
      userId: user.id,
      coverLetter: validatedCoverLetter,
      customResume: validatedCustomResume || null,
      status: 'pending',
      appliedAt: new Date(),
    };

    const [createdApplication] = await db
      .insert(jobApplications)
      .values(newApplication)
      .returning();

    // Update job application count
    await db
      .update(jobs)
      .set({
        applicationCount: db.$count(jobApplications, eq(jobApplications.jobId, validatedJobId)),
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, validatedJobId));

    // Log activity
    await logActivity(
      user.id,
      ActivityType.APPLICATION_SUBMITTED,
      'job',
      validatedJobId,
      {
        jobTitle: job[0].title,
        companyId: job[0].companyId,
        applicationId: createdApplication.id,
      }
    );

    revalidatePath('/dashboard/applications');
    revalidatePath(`/jobs/${validatedJobId}`);
    
    return { success: true, applicationId: createdApplication.id };
  } catch (error) {
    console.error('Error submitting application:', error);
    throw new Error('Failed to submit application. Please try again.');
  }
}

export async function getUserApplications() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  try {
    const applications = await db
      .select({
        id: jobApplications.id,
        status: jobApplications.status,
        appliedAt: jobApplications.appliedAt,
        reviewedAt: jobApplications.reviewedAt,
        coverLetter: jobApplications.coverLetter,
        jobId: jobs.id,
        jobTitle: jobs.title,
        jobLocation: jobs.location,
        jobType: jobs.type,
        workMode: jobs.workMode,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        companyName: companies.name,
        companyLogo: companies.logo,
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobApplications.userId, user.id))
      .orderBy(desc(jobApplications.appliedAt));

    return applications;
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return [];
  }
}

const updateApplicationStatusSchema = z.object({
  applicationId: z.number(),
  status: z.enum(['pending', 'reviewed', 'interview', 'rejected', 'accepted']),
  notes: z.string().optional(),
});

export async function updateApplicationStatus(formData: FormData) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'employer') {
    throw new Error('Only employers can update application status');
  }

  const applicationId = parseInt(formData.get('applicationId') as string);
  const status = formData.get('status') as string;
  const notes = formData.get('notes') as string;

  const validation = updateApplicationStatusSchema.safeParse({
    applicationId,
    status,
    notes,
  });

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }

  const { applicationId: validatedApplicationId, status: validatedStatus, notes: validatedNotes } = validation.data;

  try {
    // Get application details to verify ownership
    const application = await db
      .select({
        id: jobApplications.id,
        userId: jobApplications.userId,
        jobId: jobApplications.jobId,
        status: jobApplications.status,
        job: {
          id: jobs.id,
          title: jobs.title,
          createdById: jobs.createdById,
          companyId: jobs.companyId,
        }
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(eq(jobApplications.id, validatedApplicationId))
      .limit(1);

    if (application.length === 0) {
      throw new Error('Application not found');
    }

    const app = application[0];

    // Verify that the employer owns this job
    if (app.job.createdById !== user.id) {
      throw new Error('You can only update applications for your own jobs');
    }

    // Update the application
    await db
      .update(jobApplications)
      .set({
        status: validatedStatus,
        reviewedAt: new Date(),
        reviewedById: user.id,
        notes: validatedNotes || null,
        updatedAt: new Date(),
      })
      .where(eq(jobApplications.id, validatedApplicationId));

    // Log activity for both employer and applicant
    await Promise.all([
      // Employer activity
      logActivity(
        user.id,
        ActivityType.APPLICATION_REVIEWED,
        'application',
        validatedApplicationId,
        {
          jobTitle: app.job.title,
          applicantId: app.userId,
          newStatus: validatedStatus,
          oldStatus: app.status,
        }
      ),
      // Applicant activity (for their activity feed)
      logActivity(
        app.userId,
        validatedStatus === 'accepted' ? ActivityType.APPLICATION_ACCEPTED : ActivityType.APPLICATION_REVIEWED,
        'application',
        validatedApplicationId,
        {
          jobTitle: app.job.title,
          companyId: app.job.companyId,
          newStatus: validatedStatus,
          reviewedBy: user.id,
        }
      ),
    ]);

    revalidatePath('/dashboard/employer/applications');
    revalidatePath(`/dashboard/employer/applications/${validatedApplicationId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating application status:', error);
    throw new Error('Failed to update application status. Please try again.');
  }
}

export async function getJobApplications(jobId?: number) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'employer') {
    throw new Error('Only employers can view job applications');
  }

  try {
    const whereCondition = jobId 
      ? and(eq(jobs.createdById, user.id), eq(jobs.id, jobId))
      : eq(jobs.createdById, user.id);

    const applications = await db
      .select({
        id: jobApplications.id,
        status: jobApplications.status,
        appliedAt: jobApplications.appliedAt,
        reviewedAt: jobApplications.reviewedAt,
        coverLetter: jobApplications.coverLetter,
        notes: jobApplications.notes,
        jobId: jobs.id,
        jobTitle: jobs.title,
        applicant: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
          location: users.location,
        },
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .innerJoin(users, eq(jobApplications.userId, users.id))
      .where(whereCondition)
      .orderBy(desc(jobApplications.appliedAt));

    return applications;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return [];
  }
}

export async function withdrawApplication(applicationId: number) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'job_seeker') {
    throw new Error('Only job seekers can withdraw applications');
  }

  try {
    // Get application details to verify ownership
    const application = await db
      .select({
        id: jobApplications.id,
        userId: jobApplications.userId,
        jobId: jobApplications.jobId,
        status: jobApplications.status,
        job: {
          title: jobs.title,
          companyId: jobs.companyId,
        }
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(eq(jobApplications.id, applicationId))
      .limit(1);

    if (application.length === 0) {
      throw new Error('Application not found');
    }

    const app = application[0];

    // Verify ownership
    if (app.userId !== user.id) {
      throw new Error('You can only withdraw your own applications');
    }

    // Check if application can be withdrawn
    if (app.status === 'accepted' || app.status === 'rejected') {
      throw new Error('Cannot withdraw application that has been finalized');
    }

    // Delete the application
    await db.delete(jobApplications).where(eq(jobApplications.id, applicationId));

    // Update job application count
    await db
      .update(jobs)
      .set({
        applicationCount: db.$count(jobApplications, eq(jobApplications.jobId, app.jobId)),
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, app.jobId));

    // Log activity
    await logActivity(
      user.id,
      ActivityType.APPLICATION_REVIEWED, // We can reuse this or create a new WITHDRAWN type
      'application',
      applicationId,
      {
        jobTitle: app.job.title,
        companyId: app.job.companyId,
        action: 'withdrawn',
      }
    );

    revalidatePath('/dashboard/applications');
    
    return { success: true };
  } catch (error) {
    console.error('Error withdrawing application:', error);
    throw new Error('Failed to withdraw application. Please try again.');
  }
}