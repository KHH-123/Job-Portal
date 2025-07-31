import { eq } from 'drizzle-orm';
import { db } from './drizzle';
import { users, jobs, companies, applications, type User } from './schema';

export async function getUser(email?: string): Promise<User | null> {
  if (!email) return null;
  
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function getJobs() {
  try {
    return await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        location: jobs.location,
        type: jobs.type,
        salary: jobs.salary,
        company: {
          id: companies.id,
          name: companies.name,
          logo: companies.logo
        },
        createdAt: jobs.createdAt
      })
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.isActive, true))
      .orderBy(jobs.createdAt);
  } catch (error) {
    console.error('Error getting jobs:', error);
    return [];
  }
}

export async function getJobById(id: number) {
  try {
    const result = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        location: jobs.location,
        type: jobs.type,
        salary: jobs.salary,
        requirements: jobs.requirements,
        benefits: jobs.benefits,
        company: {
          id: companies.id,
          name: companies.name,
          logo: companies.logo,
          description: companies.description,
          website: companies.website
        },
        createdAt: jobs.createdAt
      })
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.id, id))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error getting job:', error);
    return null;
  }
}

export async function getApplications(userId: number) {
  try {
    return await db
      .select({
        id: applications.id,
        status: applications.status,
        appliedAt: applications.appliedAt,
        job: {
          id: jobs.id,
          title: jobs.title,
          company: companies.name
        }
      })
      .from(applications)
      .leftJoin(jobs, eq(applications.jobId, jobs.id))
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(applications.userId, userId))
      .orderBy(applications.appliedAt);
  } catch (error) {
    console.error('Error getting applications:', error);
    return [];
  }
}
