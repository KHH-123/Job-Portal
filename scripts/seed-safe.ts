import { db } from '../lib/db/drizzle';
import { 
  users, 
  companies, 
  jobs, 
  jobApplications, 
  userProfiles,
  jobViews,
  activityLogs 
} from '../lib/db/schema';
import { eq, count } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { subDays, subHours } from 'date-fns';

async function seedSafely() {
  try {
    console.log('🌱 Starting safe seeding process...');

    // Check if we already have data
    const userCount = await db.select({ count: count() }).from(users);
    const existingUserCount = userCount[0]?.count || 0;

    if (existingUserCount > 0) {
      console.log(`✓ Database already has ${existingUserCount} users. Seeding only missing data...`);
    } else {
      console.log('📝 Seeding initial data...');
    }

    const now = new Date();
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Seed test users if they don't exist
    const existingJobSeeker = await db.select().from(users).where(eq(users.email, 'jobseeker@example.com')).limit(1);
    let jobSeeker: any;
    
    if (existingJobSeeker.length === 0) {
      const newJobSeekers = await db.insert(users).values({
        name: 'Jane Doe',
        email: 'jobseeker@example.com',
        passwordHash: hashedPassword,
        role: 'job_seeker',
        location: 'New York, NY',
        isEmailVerified: true,
      }).returning();
      jobSeeker = newJobSeekers[0];
      console.log('✓ Job seeker user created');
    } else {
      jobSeeker = existingJobSeeker[0];
      console.log('✓ Job seeker user exists');
    }

    const existingEmployer = await db.select().from(users).where(eq(users.email, 'employer@example.com')).limit(1);
    let employer: any;

    if (existingEmployer.length === 0) {
      const newEmployers = await db.insert(users).values({
        name: 'John Smith',
        email: 'employer@example.com',
        passwordHash: hashedPassword,
        role: 'employer',
        location: 'San Francisco, CA',
        isEmailVerified: true,
      }).returning();
      employer = newEmployers[0];
      console.log('✓ Employer user created');
    } else {
      employer = existingEmployer[0];
      console.log('✓ Employer user exists');
    }

    // Seed company if it doesn't exist
    const existingCompany = await db.select().from(companies).where(eq(companies.slug, 'tech-corp')).limit(1);
    let company: any;

    if (existingCompany.length === 0) {
      const newCompanies = await db.insert(companies).values({
        name: 'TechCorp Inc.',
        slug: 'tech-corp',
        description: 'Leading technology company building innovative solutions.',
        logo: 'https://placehold.co/80x80/3b82f6/ffffff?text=TC',
        website: 'https://techcorp.com',
        industry: 'Technology',
        size: '100-500 employees',
        location: 'San Francisco, CA',
        foundedYear: 2018,
        ownerId: employer.id,
        isVerified: true,
      }).returning();
      company = newCompanies[0];
      console.log('✓ Company created');
    } else {
      company = existingCompany[0];
      console.log('✓ Company exists');
    }

    // Check if jobs exist before creating
    const existingJobsCount = await db.select({ count: count() }).from(jobs);
    const jobCount = existingJobsCount[0]?.count || 0;

    if (jobCount === 0) {
      // Create sample jobs
      const jobsData = [
        {
          title: 'Senior Software Engineer',
          slug: 'senior-software-engineer-' + Date.now(),
          description: 'We are looking for a senior software engineer to join our team and build amazing products.',
          requirements: 'Bachelor\'s degree in Computer Science, 5+ years of experience with React, Node.js, and TypeScript',
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
          applicationCount: 3,
          createdAt: subDays(now, 10),
          skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL']
        },
        {
          title: 'Frontend Developer',
          slug: 'frontend-developer-' + Date.now(),
          description: 'Join our frontend team to build amazing user experiences using modern technologies.',
          requirements: 'Experience with React, TypeScript, modern CSS frameworks, and testing libraries',
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
          applicationCount: 5,
          createdAt: subDays(now, 5),
          skills: ['React', 'JavaScript', 'CSS', 'Tailwind']
        },
        {
          title: 'Product Manager',
          slug: 'product-manager-' + Date.now(),
          description: 'Drive product strategy and work with engineering teams to deliver exceptional products.',
          requirements: '3+ years of product management experience, strong analytical skills, experience with agile methodologies',
          location: 'New York, NY',
          salaryMin: '110000',
          salaryMax: '150000',
          type: 'full_time' as const,
          experienceLevel: 'mid' as const,
          workMode: 'hybrid' as const,
          status: 'active' as const,
          companyId: company.id,
          createdById: employer.id,
          viewCount: 28,
          applicationCount: 2,
          createdAt: subDays(now, 3),
          skills: ['Product Strategy', 'Analytics', 'Agile', 'Leadership']
        }
      ];

      const createdJobs = await db.insert(jobs).values(jobsData).returning();
      console.log('✓ Sample jobs created');

      // Create profile for job seeker if it doesn't exist
      const existingProfile = await db.select().from(userProfiles).where(eq(userProfiles.userId, jobSeeker.id)).limit(1);
      
      if (existingProfile.length === 0) {
        await db.insert(userProfiles).values({
          userId: jobSeeker.id,
          title: 'Full Stack Developer',
          summary: 'Experienced software developer with 5+ years of experience in building web applications using React, Node.js, and modern technologies.',
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
          experience: '5+ years of full-stack development experience',
          education: [{ 
            degree: 'BS Computer Science', 
            school: 'University of California Berkeley', 
            year: 2018,
            gpa: '3.8'
          }],
          expectedSalary: '125000',
          isOpenToWork: true,
          linkedinUrl: 'https://linkedin.com/in/jane-doe',
          githubUrl: 'https://github.com/jane-doe',
        });
        console.log('✓ User profile created');
      }

      // Create sample applications
      const applicationsData = [
        {
          jobId: createdJobs[0].id,
          userId: jobSeeker.id,
          status: 'pending' as const,
          coverLetter: 'I am very excited about this Senior Software Engineer position. With my 5+ years of experience in React and Node.js, I believe I would be a great fit for your team.',
          appliedAt: subDays(now, 2),
        },
        {
          jobId: createdJobs[1].id,
          userId: jobSeeker.id,
          status: 'reviewed' as const,
          coverLetter: 'I would love to contribute to your frontend team. I have extensive experience with React and modern CSS frameworks.',
          appliedAt: subDays(now, 5),
          reviewedAt: subDays(now, 3),
        }
      ];

      await db.insert(jobApplications).values(applicationsData);
      console.log('✓ Sample applications created');

      // Create sample job views for analytics
      const viewsData = [];
      for (let i = 0; i < 50; i++) {
        const viewDate = subDays(now, Math.floor(Math.random() * 30));
        viewsData.push({
          jobId: createdJobs[Math.floor(Math.random() * createdJobs.length)].id,
          userId: Math.random() > 0.5 ? jobSeeker.id : null, // Some anonymous views
          viewedAt: subHours(viewDate, Math.floor(Math.random() * 24)),
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });
      }

      await db.insert(jobViews).values(viewsData);
      console.log('✓ Sample job views created for analytics');

      // Create activity logs
      const activityData = [
        {
          userId: jobSeeker.id,
          action: 'SIGN_UP',
          entityType: 'user',
          entityId: jobSeeker.id,
          timestamp: subDays(now, 15),
          metadata: { source: 'direct' }
        },
        {
          userId: jobSeeker.id,
          action: 'APPLICATION_SUBMITTED',
          entityType: 'application',
          entityId: applicationsData[0].jobId,
          timestamp: subDays(now, 2),
          metadata: { jobTitle: jobsData[0].title }
        },
        {
          userId: employer.id,
          action: 'SIGN_UP',
          entityType: 'user',
          entityId: employer.id,
          timestamp: subDays(now, 20),
          metadata: { source: 'direct' }
        },
        {
          userId: employer.id,
          action: 'JOB_CREATED',
          entityType: 'job',
          entityId: createdJobs[0].id,
          timestamp: subDays(now, 10),
          metadata: { jobTitle: jobsData[0].title }
        }
      ];

      await db.insert(activityLogs).values(activityData);
      console.log('✓ Activity logs created');
    } else {
      console.log(`✓ Database already has ${jobCount} jobs, skipping job creation`);
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('👤 Job Seeker: jobseeker@example.com / admin123');
    console.log('🏢 Employer: employer@example.com / admin123');
    console.log('\n🔗 Access URLs:');
    console.log('🏠 Main Site: http://localhost:3000');
    console.log('🔐 Sign In: http://localhost:3000/sign-in');
    console.log('📄 Jobs: http://localhost:3000/jobs');
    console.log('📊 Dashboard: http://localhost:3000/dashboard');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

// Export the function for external use
export { seedSafely };

// Run if called directly
if (require.main === module) {
  seedSafely()
    .then(() => {
      console.log('✅ Seeding process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}