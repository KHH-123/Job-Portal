'use server';

import { db } from '@/lib/db/drizzle';
import { jobs, companies } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createJob(formData: {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  type: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  workMode: 'remote' | 'onsite' | 'hybrid';
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
  applicationDeadline?: string;
  skills?: string[];
  status: 'draft' | 'active';
}) {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'employer') {
    throw new Error('Only employers can create jobs');
  }

  try {
    // Get user's company
    const userCompany = await db
      .select()
      .from(companies)
      .where(eq(companies.ownerId, user.id))
      .limit(1);

    if (userCompany.length === 0) {
      throw new Error('No company found. Please create your company profile first.');
    }

    const company = userCompany[0];

    // Generate slug from title
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now();

    // Create the job
    const newJob = await db
      .insert(jobs)
      .values({
        title: formData.title,
        slug: slug,
        description: formData.description,
        requirements: formData.requirements || null,
        benefits: formData.benefits || null,
        companyId: company.id,
        type: formData.type,
        experienceLevel: formData.experienceLevel,
        workMode: formData.workMode,
        location: formData.location || null,
        salaryMin: formData.salaryMin || null,
        salaryMax: formData.salaryMax || null,
        currency: formData.currency || 'USD',
        skills: formData.skills || null,
        status: formData.status,
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : null,
        createdById: user.id,
        viewCount: 0,
        applicationCount: 0,
      })
      .returning();

    revalidatePath('/dashboard/employer/jobs');
    revalidatePath('/jobs');
    
    return { success: true, job: newJob[0] };
  } catch (error) {
    console.error('Error creating job:', error);
    throw new Error('Failed to create job. Please try again.');
  }
}

export async function updateJob(
  jobId: number, 
  formData: {
    title: string;
    description: string;
    requirements?: string;
    benefits?: string;
    type: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
    experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
    workMode: 'remote' | 'onsite' | 'hybrid';
    location?: string;
    salaryMin?: string;
    salaryMax?: string;
    currency?: string;
    applicationDeadline?: string;
    skills?: string[];
    status: 'draft' | 'active' | 'paused' | 'closed';
  }
) {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'employer') {
    throw new Error('Only employers can update jobs');
  }

  try {
    // Verify the job belongs to the user
    const job = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (job.length === 0) {
      throw new Error('Job not found');
    }

    if (job[0].createdById !== user.id) {
      throw new Error('You can only edit your own jobs');
    }

    // Update the job
    const updatedJob = await db
      .update(jobs)
      .set({
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements || null,
        benefits: formData.benefits || null,
        type: formData.type,
        experienceLevel: formData.experienceLevel,
        workMode: formData.workMode,
        location: formData.location || null,
        salaryMin: formData.salaryMin || null,
        salaryMax: formData.salaryMax || null,
        currency: formData.currency || 'USD',
        skills: formData.skills || null,
        status: formData.status,
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : null,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId))
      .returning();

    revalidatePath('/dashboard/employer/jobs');
    revalidatePath('/jobs');
    revalidatePath(`/jobs/${jobId}`);
    
    return { success: true, job: updatedJob[0] };
  } catch (error) {
    console.error('Error updating job:', error);
    throw new Error('Failed to update job. Please try again.');
  }
}

export async function deleteJob(jobId: number) {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'employer') {
    throw new Error('Only employers can delete jobs');
  }

  try {
    // Verify the job belongs to the user
    const job = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (job.length === 0) {
      throw new Error('Job not found');
    }

    if (job[0].createdById !== user.id) {
      throw new Error('You can only delete your own jobs');
    }

    // Delete the job (this will cascade to applications due to foreign key constraints)
    await db.delete(jobs).where(eq(jobs.id, jobId));

    revalidatePath('/dashboard/employer/jobs');
    revalidatePath('/jobs');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting job:', error);
    throw new Error('Failed to delete job. Please try again.');
  }
}