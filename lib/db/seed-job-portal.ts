import { db } from './drizzle';
import { 
  users, 
  companies, 
  jobs, 
  jobApplications, 
  userProfiles, 
  jobViews,
  activityLogs 
} from './schema';
import { hashPassword } from '@/lib/auth/session';
import { subDays, subHours } from 'date-fns';

async function seedJobPortal() {
  console.log('Starting job portal seed...');

  const password = 'admin123';
  const passwordHash = await hashPassword(password);
  const now = new Date();

  try {
    // Check for existing users first
    let jobSeeker, employer;
    
    const existingJobSeeker = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, 'jobseeker@example.com')
    });
    
    const existingEmployer = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, 'employer@example.com')
    });
    
    if (existingJobSeeker && existingEmployer) {
      jobSeeker = existingJobSeeker;
      employer = existingEmployer;
      console.log('✓ Using existing users');
    } else {
      // Create users if they don't exist
      [jobSeeker, employer] = await db
        .insert(users)
        .values([
          {
            email: 'jobseeker@example.com',
            passwordHash: passwordHash,
            name: 'John Seeker',
            role: 'job_seeker'
          },
          {
            email: 'employer@example.com',
            passwordHash: passwordHash,
            name: 'Jane Employer',
            role: 'employer'
          }
        ])
        .returning();
      
      console.log('✓ Users created');
    }

    // Create company
    const [company] = await db
      .insert(companies)
      .values([
        {
          name: 'Tech Corp',
          slug: 'tech-corp',
          description: 'A leading technology company',
          website: 'https://techcorp.com',
          location: 'San Francisco, CA',
          size: '100-500',
          industry: 'Technology',
          ownerId: employer.id
        }
      ])
      .returning();

    console.log('✓ Company created');

    // Create user profile for job seeker
    await db
      .insert(userProfiles)
      .values([
        {
          userId: jobSeeker.id,
          summary: 'Experienced software developer looking for new opportunities',
          skills: ['JavaScript', 'React', 'Node.js', 'Python'],
          experience: '5+ years',
          education: [{ degree: 'BS Computer Science', school: 'University of California', year: 2018 }],
          expectedSalary: '120000'
        }
      ]);

    console.log('✓ User profile created');

    // Create sample jobs
    const jobsData = [
      {
        title: 'Senior Software Engineer',
        slug: 'senior-software-engineer',
        description: 'We are looking for a senior software engineer to join our team.',
        requirements: 'Bachelor\'s degree in Computer Science, 5+ years of experience',
        location: 'San Francisco, CA',
        salaryMin: '120000',
        salaryMax: '160000',
        type: 'full_time' as const,
        experienceLevel: 'senior' as const,
        workMode: 'onsite' as const,
        status: 'active' as const,
        companyId: company.id,
        createdById: employer.id,
        viewCount: 45,
        applicationCount: 8,
        createdAt: subDays(now, 10)
      },
      {
        title: 'Frontend Developer',
        slug: 'frontend-developer',
        description: 'Join our frontend team to build amazing user experiences.',
        requirements: 'Experience with React, TypeScript, and modern frontend tools',
        location: 'Remote',
        salaryMin: '90000',
        salaryMax: '130000',
        type: 'full_time' as const,
        experienceLevel: 'mid' as const,
        workMode: 'remote' as const,
        status: 'active' as const,
        companyId: company.id,
        createdById: employer.id,
        viewCount: 32,
        applicationCount: 12,
        createdAt: subDays(now, 5)
      },
      {
        title: 'DevOps Engineer',
        slug: 'devops-engineer',
        description: 'Help us scale our infrastructure and deployment processes.',
        requirements: 'Experience with AWS, Docker, Kubernetes, and CI/CD',
        location: 'San Francisco, CA',
        salaryMin: '110000',
        salaryMax: '150000',
        type: 'full_time' as const,
        experienceLevel: 'senior' as const,
        workMode: 'hybrid' as const,
        status: 'closed' as const,
        companyId: company.id,
        createdById: employer.id,
        viewCount: 28,
        applicationCount: 6,
        createdAt: subDays(now, 15)
      }
    ];

    const createdJobs = await db
      .insert(jobs)
      .values(jobsData)
      .returning();

    console.log('✓ Jobs created');

    // Create job applications
    const applicationsData = [
      {
        jobId: createdJobs[0].id,
        userId: jobSeeker.id,
        status: 'accepted' as const,
        coverLetter: 'I am very interested in this position and believe I would be a great fit.',
        appliedAt: subDays(now, 8),
        reviewedAt: subDays(now, 5)
      },
      {
        jobId: createdJobs[1].id,
        userId: jobSeeker.id,
        status: 'reviewed' as const,
        coverLetter: 'I would love to contribute to your frontend team.',
        appliedAt: subDays(now, 3)
      },
      {
        jobId: createdJobs[2].id,
        userId: jobSeeker.id,
        status: 'rejected' as const,
        coverLetter: 'I have extensive DevOps experience.',
        appliedAt: subDays(now, 12),
        reviewedAt: subDays(now, 10)
      }
    ];

    await db
      .insert(jobApplications)
      .values(applicationsData);

    console.log('✓ Job applications created');

    // Create job views for analytics
    const viewsData = [];
    for (let i = 0; i < 30; i++) {
      const viewDate = subDays(now, i);
      const viewsPerDay = Math.floor(Math.random() * 10) + 1;
      
      for (let j = 0; j < viewsPerDay; j++) {
        viewsData.push({
          jobId: createdJobs[Math.floor(Math.random() * createdJobs.length)].id,
          userId: Math.random() > 0.5 ? jobSeeker.id : null, // Some anonymous views
          viewedAt: subHours(viewDate, Math.floor(Math.random() * 24))
        });
      }
    }

    await db
      .insert(jobViews)
      .values(viewsData);

    console.log('✓ Job views created');

    // Create activity logs
    const activityData = [
      {
        userId: jobSeeker.id,
        action: 'application_submitted',
        timestamp: subDays(now, 8),
        metadata: { jobId: createdJobs[0].id, jobTitle: createdJobs[0].title }
      },
      {
        userId: jobSeeker.id,
        action: 'application_submitted',
        timestamp: subDays(now, 3),
        metadata: { jobId: createdJobs[1].id, jobTitle: createdJobs[1].title }
      },
      {
        userId: jobSeeker.id,
        action: 'profile_updated',
        timestamp: subDays(now, 1),
        metadata: { section: 'skills' }
      },
      {
        userId: employer.id,
        action: 'job_posted',
        timestamp: subDays(now, 10),
        metadata: { jobId: createdJobs[0].id, jobTitle: createdJobs[0].title }
      },
      {
        userId: employer.id,
        action: 'application_reviewed',
        timestamp: subDays(now, 5),
        metadata: { applicationId: applicationsData[0].jobId }
      }
    ];

    await db
      .insert(activityLogs)
      .values(activityData);

    console.log('✓ Activity logs created');

    console.log('Job portal seed completed successfully!');
    console.log('Test accounts:');
    console.log('- Job Seeker: jobseeker@example.com / admin123');
    console.log('- Employer: employer@example.com / admin123');

  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  }
}

seedJobPortal()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });