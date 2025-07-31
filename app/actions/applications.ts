'use server';

import { db } from '@/lib/db';
import { applications, jobs, companies, users } from '@/lib/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export async function getUserApplications() {
  const user = await getUser();
  
  if (!user || user.role !== 'job_seeker') {
    return [];
  }

  try {
    const userApplications = await db
      .select({
        id: applications.id,
        status: applications.status,
        appliedAt: applications.appliedAt,
        jobId: jobs.id,
        jobTitle: jobs.title,
        jobLocation: jobs.location,
        jobType: jobs.type,
        salary: jobs.salary,
        companyName: companies.name,
        companyLogo: companies.logo,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(applications.userId, user.id))
      .orderBy(desc(applications.appliedAt));

    return userApplications;
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return [];
  }
}

export async function withdrawApplication(applicationId: number) {
  const user = await getUser();
  
  if (!user || user.role !== 'job_seeker') {
    throw new Error('Unauthorized');
  }

  try {
    await db
      .delete(applications)
      .where(eq(applications.id, applicationId));

    return { success: true };
  } catch (error) {
    console.error('Error withdrawing application:', error);
    throw error;
  }
}

export async function updateApplicationStatus(applicationId: number, status: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected') {
  const user = await getUser();
  
  if (!user || user.role !== 'employer') {
    throw new Error('Unauthorized');
  }

  try {
    await db
      .update(applications)
      .set({ 
        status,
      })
      .where(eq(applications.id, applicationId));

    return { success: true };
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
}

export async function applyToJob(jobId: number, coverLetter?: string) {
  const user = await getUser();
  
  if (!user || user.role !== 'job_seeker') {
    throw new Error('Unauthorized');
  }

  try {
    // Check if user has already applied to this job
    const existingApplication = await db
      .select()
      .from(applications)
      .where(and(eq(applications.jobId, jobId), eq(applications.userId, user.id)))
      .limit(1);

    if (existingApplication.length > 0) {
      throw new Error('You have already applied to this job');
    }

    // Create new application
    const newApplication = await db
      .insert(applications)
      .values({
        userId: user.id,
        jobId,
        status: 'pending',
        coverLetter: coverLetter || '',
        appliedAt: new Date(),
      })
      .returning();

    return { success: true, applicationId: newApplication[0].id };
  } catch (error) {
    console.error('Error applying to job:', error);
    throw error;
  }
}
