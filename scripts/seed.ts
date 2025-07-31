import { db } from '../lib/db/drizzle';
import { users, companies, jobs, applications } from '../lib/db/schema';
import { hashPassword } from '../lib/auth/session';

async function seed() {
  console.log('🌱 Seeding database with real company data...');

  try {
    // Create test users
    const hashedPassword = await hashPassword('admin123');
    
    const testUsers = await db.insert(users).values([
      {
        email: 'jobseeker@example.com',
        passwordHash: hashedPassword,
        name: 'John Smith',
        role: 'job_seeker'
      },
      {
        email: 'employer@example.com',
        passwordHash: hashedPassword,
        name: 'Sarah Johnson',
        role: 'employer'
      }
    ]).returning();

    console.log('✅ Created test users');

    // Create real companies
    const companiesData = await db.insert(companies).values([
      {
        name: 'Google',
        description: 'A multinational technology company that specializes in Internet-related services and products.',
        website: 'https://google.com',
        industry: 'Technology',
        size: '10000+',
        location: 'Mountain View, CA'
      },
      {
        name: 'Microsoft',
        description: 'American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.',
        website: 'https://microsoft.com',
        industry: 'Technology',
        size: '10000+',
        location: 'Redmond, WA'
      },
      {
        name: 'Apple',
        description: 'American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.',
        website: 'https://apple.com',
        industry: 'Technology',
        size: '10000+',
        location: 'Cupertino, CA'
      },
      {
        name: 'Amazon',
        description: 'American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
        website: 'https://amazon.com',
        industry: 'Technology',
        size: '10000+',
        location: 'Seattle, WA'
      },
      {
        name: 'Meta',
        description: 'American technology company that owns Facebook, Instagram, and WhatsApp.',
        website: 'https://meta.com',
        industry: 'Technology',
        size: '10000+',
        location: 'Menlo Park, CA'
      },
      {
        name: 'Netflix',
        description: 'American subscription streaming service and production company.',
        website: 'https://netflix.com',
        industry: 'Entertainment',
        size: '5000-10000',
        location: 'Los Gatos, CA'
      },
      {
        name: 'Tesla',
        description: 'American electric vehicle and clean energy company.',
        website: 'https://tesla.com',
        industry: 'Automotive',
        size: '1000-5000',
        location: 'Austin, TX'
      },
      {
        name: 'Spotify',
        description: 'Swedish audio streaming and media services provider.',
        website: 'https://spotify.com',
        industry: 'Entertainment',
        size: '1000-5000',
        location: 'Stockholm, Sweden'
      },
      {
        name: 'Uber',
        description: 'American mobility as a service provider.',
        website: 'https://uber.com',
        industry: 'Transportation',
        size: '1000-5000',
        location: 'San Francisco, CA'
      },
      {
        name: 'Airbnb',
        description: 'American vacation rental online marketplace company.',
        website: 'https://airbnb.com',
        industry: 'Travel',
        size: '1000-5000',
        location: 'San Francisco, CA'
      },
      {
        name: 'Stripe',
        description: 'Irish-American financial services and software as a service company.',
        website: 'https://stripe.com',
        industry: 'Fintech',
        size: '1000-5000',
        location: 'San Francisco, CA'
      },
      {
        name: 'OpenAI',
        description: 'American artificial intelligence research laboratory.',
        website: 'https://openai.com',
        industry: 'AI/ML',
        size: '100-500',
        location: 'San Francisco, CA'
      }
    ]).returning();

    console.log('✅ Created 12 major companies');

    // Create realistic job postings
    const jobsData = [
      {
        title: 'Senior Software Engineer',
        description: 'Join our team to build the next generation of search technologies. We are looking for experienced engineers who are passionate about solving complex technical challenges at scale.',
        companyId: companiesData.find(c => c.name === 'Google')?.id,
        location: 'Mountain View, CA',
        type: 'Full-time',
        salary: '$180,000 - $250,000',
        requirements: 'BS/MS in Computer Science, 5+ years of software development experience, proficiency in Java/Python/C++, experience with distributed systems',
        benefits: 'Health insurance, 401k matching, stock options, flexible PTO, free meals',
        postedBy: testUsers[1].id,
        isActive: true
      },
      {
        title: 'Product Manager',
        description: 'Lead product development for Azure cloud services. Drive product strategy and work closely with engineering teams to deliver world-class cloud solutions.',
        companyId: companiesData.find(c => c.name === 'Microsoft')?.id,
        location: 'Redmond, WA',
        type: 'Full-time',
        salary: '$150,000 - $220,000',
        requirements: 'MBA or equivalent experience, 3+ years in product management, experience with cloud technologies, strong analytical skills',
        benefits: 'Comprehensive health coverage, stock purchase plan, professional development budget, hybrid work options',
        postedBy: testUsers[1].id,
        isActive: true
      },
      {
        title: 'iOS Developer',
        description: 'Develop innovative iOS applications that millions of users love. Join the team behind the App Store and iOS ecosystem.',
        companyId: companiesData.find(c => c.name === 'Apple')?.id,
        location: 'Cupertino, CA',
        type: 'Full-time',
        salary: '$160,000 - $230,000',
        requirements: 'Strong experience with Swift and Objective-C, iOS SDK expertise, published apps on App Store preferred, CS degree or equivalent',
        benefits: 'Employee stock purchase plan, comprehensive benefits, on-site fitness center, product discounts',
        postedBy: testUsers[1].id,
        isActive: true
      },
      {
        title: 'Data Scientist',
        description: 'Use machine learning and statistical analysis to improve customer experience and business operations at scale.',
        companyId: companiesData.find(c => c.name === 'Amazon')?.id,
        location: 'Seattle, WA',
        type: 'Full-time',
        salary: '$140,000 - $200,000',
        requirements: 'PhD/MS in Statistics, Math, CS or related field, experience with Python/R, machine learning frameworks, SQL proficiency',
        benefits: 'Competitive salary, RSUs, health benefits, career development programs, relocation assistance',
        postedBy: testUsers[1].id,
        isActive: true
      },
      {
        title: 'Frontend Engineer',
        description: 'Build user interfaces for billions of users across Facebook, Instagram, and WhatsApp platforms.',
        companyId: companiesData.find(c => c.name === 'Meta')?.id,
        location: 'Menlo Park, CA',
        type: 'Full-time',
        salary: '$170,000 - $240,000',
        requirements: 'Expert knowledge of React, JavaScript, HTML/CSS, experience with modern frontend tooling, GraphQL experience preferred',
        benefits: 'Meta stock options, free meals, shuttle service, wellness programs, generous PTO',
        postedBy: testUsers[1].id,
        isActive: true
      },
      {
        title: 'DevOps Engineer',
        description: 'Scale our streaming infrastructure to serve 200M+ users globally. Work with cutting-edge cloud technologies.',
        companyId: companiesData.find(c => c.name === 'Netflix')?.id,
        location: 'Los Gatos, CA',
        type: 'Full-time',
        salary: '$160,000 - $220,000',
        requirements: 'Experience with AWS/GCP, Kubernetes, Docker, CI/CD pipelines, monitoring tools, scripting languages',
        benefits: 'Unlimited PTO, stock options, top-tier health insurance, learning budget, flexible work arrangements',
        postedBy: testUsers[1].id,
        isActive: true
      },
      {
        title: 'AI/ML Engineer',
        description: 'Develop autonomous driving algorithms and neural networks for Tesla vehicles. Shape the future of transportation.',
        companyId: companiesData.find(c => c.name === 'Tesla')?.id,
        location: 'Austin, TX',
        type: 'Full-time',
        salary: '$180,000 - $260,000',
        requirements: 'PhD in ML/AI or related field, experience with PyTorch/TensorFlow, computer vision, deep learning, autonomous systems knowledge',
        benefits: 'Tesla stock options, health benefits, employee vehicle discount, cutting-edge research environment',
        postedBy: testUsers[1].id,
        isActive: true
      },
      {
        title: 'Backend Engineer',
        description: 'Build scalable music streaming services that serve 400M+ users worldwide. Work on recommendation systems and audio processing.',
        companyId: companiesData.find(c => c.name === 'Spotify')?.id,
        location: 'Stockholm, Sweden',
        type: 'Full-time',
        salary: '€80,000 - €120,000',
        requirements: 'Experience with Java/Python, microservices architecture, cloud platforms, music/audio processing knowledge a plus',
        benefits: 'Spotify Premium, flexible hours, wellness allowance, parental leave, stock options',
        postedBy: testUsers[1].id,
        isActive: true
      },
      {
        title: 'Mobile Engineer',
        description: 'Develop the Uber app used by millions of riders and drivers daily. Focus on real-time mapping and location services.',
        companyId: companiesData.find(c => c.name === 'Uber')?.id,
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$165,000 - $230,000',
        requirements: 'iOS/Android development experience, real-time systems, mapping APIs, performance optimization, CS degree',
        benefits: 'Uber credits, equity package, health insurance, commuter benefits, professional development',
        postedBy: testUsers[1].id,
        isActive: true
      },
      {
        title: 'UX Designer',
        description: 'Design user experiences for millions of hosts and guests on the Airbnb platform. Focus on trust, safety, and community building.',
        companyId: companiesData.find(c => c.name === 'Airbnb')?.id,
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$130,000 - $180,000',
        requirements: 'Portfolio of UX work, Figma/Sketch expertise, user research experience, design systems knowledge, travel industry interest',
        benefits: 'Travel credits, equity, health benefits, sabbatical program, remote work flexibility',
        postedBy: testUsers[1].id,
        isActive: true
      },
      {
        title: 'Fullstack Engineer',
        description: 'Build payment infrastructure used by millions of businesses worldwide. Work on fraud prevention, scaling, and developer APIs.',
        companyId: companiesData.find(c => c.name === 'Stripe')?.id,
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$170,000 - $250,000',
        requirements: 'Full-stack development experience, API design, payment systems knowledge, security best practices, Ruby/Go/JavaScript',
        benefits: 'Stripe equity, comprehensive health coverage, learning budget, top-tier equipment, flexible PTO',
        postedBy: testUsers[1].id,
        isActive: true
      },
      {
        title: 'Research Scientist',
        description: 'Advance the state of artificial intelligence through groundbreaking research. Work on large language models and AI safety.',
        companyId: companiesData.find(c => c.name === 'OpenAI')?.id,
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$200,000 - $300,000',
        requirements: 'PhD in AI/ML/CS, published research papers, experience with large-scale model training, safety research interest',
        benefits: 'Competitive equity, health benefits, research budget, conference travel, cutting-edge compute resources',
        postedBy: testUsers[1].id,
        isActive: true
      }
    ];

    await db.insert(jobs).values(jobsData);
    console.log('✅ Created 12 realistic job postings');

    // Create some sample applications
    const sampleApplications = [
      {
        userId: testUsers[0].id,
        jobId: 1,
        status: 'pending' as const,
        coverLetter: 'I am very interested in this software engineering position at Google...',
        appliedAt: new Date('2024-07-25')
      },
      {
        userId: testUsers[0].id,
        jobId: 3,
        status: 'reviewing' as const,
        coverLetter: 'As an experienced iOS developer, I would love to join Apple...',
        appliedAt: new Date('2024-07-20')
      }
    ];

    await db.insert(applications).values(sampleApplications);
    console.log('✅ Created sample applications');

    console.log('🎉 Database seeded successfully with real company data!');
    console.log('\n📧 Test accounts created:');
    console.log('Job Seeker: jobseeker@example.com / admin123');
    console.log('Employer: employer@example.com / admin123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
