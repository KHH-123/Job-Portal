import { db } from '../lib/db/drizzle';
import { users, companies, jobs } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

// Real company data with updated 2024 information
const realCompanies = [
  {
    name: 'Google',
    slug: 'google',
    description: 'Google LLC is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics.',
    website: 'https://www.google.com',
    industry: 'Technology',
    size: '100000+',
    location: 'Mountain View, CA',
    foundedYear: 1998,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    benefits: ['Health Insurance', 'Stock Options', 'Free Food', 'Remote Work', 'Learning Budget']
  },
  {
    name: 'Microsoft',
    slug: 'microsoft',
    description: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, personal computers, and related services.',
    website: 'https://www.microsoft.com',
    industry: 'Technology',
    size: '50000-100000',
    location: 'Redmond, WA',
    foundedYear: 1975,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    benefits: ['Health Insurance', 'Stock Options', 'Flexible Hours', 'Remote Work', 'Professional Development']
  },
  {
    name: 'Apple',
    slug: 'apple',
    description: 'Apple Inc. is an American multinational technology company headquartered in Cupertino, California, that designs, develops, and sells consumer electronics, computer software, and online services.',
    website: 'https://www.apple.com',
    industry: 'Technology',
    size: '100000+',
    location: 'Cupertino, CA',
    foundedYear: 1976,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    benefits: ['Health Insurance', 'Stock Purchase Plan', 'Product Discounts', 'Gym Membership', 'Education Reimbursement']
  },
  {
    name: 'Meta',
    slug: 'meta',
    description: 'Meta Platforms, Inc., doing business as Meta, is an American multinational technology conglomerate based in Menlo Park, California. The company owns and operates Facebook, Instagram, Threads, and WhatsApp.',
    website: 'https://about.meta.com',
    industry: 'Technology',
    size: '50000-100000',
    location: 'Menlo Park, CA',
    foundedYear: 2004,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    benefits: ['Health Insurance', 'Stock Options', 'Free Food', 'Transportation', 'Parental Leave']
  },
  {
    name: 'Amazon',
    slug: 'amazon',
    description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.',
    website: 'https://www.amazon.com',
    industry: 'E-commerce/Technology',
    size: '100000+',
    location: 'Seattle, WA',
    foundedYear: 1994,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    benefits: ['Health Insurance', 'Stock Options', 'Career Choice Program', 'Parental Leave', 'Employee Discounts']
  },
  {
    name: 'Netflix',
    slug: 'netflix',
    description: 'Netflix, Inc. is an American subscription video on-demand over-the-top streaming service and production company based in Los Gatos, California.',
    website: 'https://www.netflix.com',
    industry: 'Entertainment/Media',
    size: '10000-50000',
    location: 'Los Gatos, CA',
    foundedYear: 1997,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    benefits: ['Unlimited PTO', 'Stock Options', 'Health Insurance', 'Flexible Work', 'Content Access']
  },
  {
    name: 'Tesla',
    slug: 'tesla',
    description: 'Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas. Tesla designs and manufactures electric vehicles, energy generation and storage systems.',
    website: 'https://www.tesla.com',
    industry: 'Automotive/Clean Energy',
    size: '50000-100000',
    location: 'Austin, TX',
    foundedYear: 2003,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg',
    benefits: ['Health Insurance', 'Stock Options', 'Free Charging', 'Product Discounts', 'Learning Opportunities']
  },
  {
    name: 'SpaceX',
    slug: 'spacex',
    description: 'Space Exploration Technologies Corp., commonly known as SpaceX, is an American spacecraft manufacturer, launcher, and satellite communications corporation.',
    website: 'https://www.spacex.com',
    industry: 'Aerospace',
    size: '10000-50000',
    location: 'Hawthorne, CA',
    foundedYear: 2002,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/SpaceX-Logo.svg',
    benefits: ['Health Insurance', 'Stock Options', 'Relocation Assistance', 'Learning Budget', 'Mission Impact']
  },
  {
    name: 'Spotify',
    slug: 'spotify',
    description: 'Spotify Technology S.A. is a Swedish audio streaming and media services provider founded in Stockholm, Sweden. It is one of the largest music streaming service providers.',
    website: 'https://www.spotify.com',
    industry: 'Music/Technology',
    size: '5000-10000',
    location: 'Stockholm, Sweden',
    foundedYear: 2006,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Spotify_icon.svg',
    benefits: ['Health Insurance', 'Flexible Hours', 'Music Access', 'Learning Budget', 'Work from Anywhere']
  },
  {
    name: 'Airbnb',
    slug: 'airbnb',
    description: 'Airbnb, Inc. is an American company operating an online marketplace for short- and long-term homestays and experiences.',
    website: 'https://www.airbnb.com',
    industry: 'Travel/Technology',
    size: '5000-10000',
    location: 'San Francisco, CA',
    foundedYear: 2008,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
    benefits: ['Health Insurance', 'Travel Credits', 'Flexible Work', 'Stock Options', 'Wellness Budget']
  },
  {
    name: 'Uber',
    slug: 'uber',
    description: 'Uber Technologies, Inc. is an American multinational ride-hailing company offering services including peer-to-peer ridesharing, ride service hailing, food delivery, and a micromobility system.',
    website: 'https://www.uber.com',
    industry: 'Transportation/Technology',
    size: '25000-50000',
    location: 'San Francisco, CA',
    foundedYear: 2009,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg',
    benefits: ['Health Insurance', 'Stock Options', 'Commuter Benefits', 'Flexible Hours', 'Learning Budget']
  },
  {
    name: 'Stripe',
    slug: 'stripe',
    description: 'Stripe, Inc. is an Irish-American financial services and software as a service company dual-headquartered in San Francisco, California and Dublin, Ireland.',
    website: 'https://stripe.com',
    industry: 'Financial Services/Technology',
    size: '5000-10000',
    location: 'San Francisco, CA',
    foundedYear: 2010,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    benefits: ['Health Insurance', 'Stock Options', 'Remote Work', 'Learning Budget', 'Office Setup Budget']
  }
];

// Real job postings with current 2024 market data
const realJobs = [
  // Google Jobs
  {
    companySlug: 'google',
    title: 'Senior Software Engineer - AI/ML',
    description: 'Join Google\'s AI team to build the next generation of machine learning systems that power billions of users worldwide. You\'ll work on cutting-edge AI research and bring innovative solutions to production.',
    requirements: 'MS/PhD in Computer Science or related field. 5+ years of experience in machine learning, deep learning, or AI. Strong programming skills in Python, TensorFlow, or PyTorch. Experience with large-scale distributed systems.',
    responsibilities: 'Design and implement ML algorithms, collaborate with research teams, optimize model performance, mentor junior engineers, and contribute to Google\'s AI research publications.',
    benefits: 'Competitive salary, equity compensation, comprehensive health benefits, free meals, on-site wellness facilities, and access to cutting-edge technology.',
    type: 'full_time',
    experienceLevel: 'senior',
    workMode: 'hybrid',
    location: 'Mountain View, CA',
    salaryMin: '180000',
    salaryMax: '280000',
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'Distributed Systems'],
    status: 'active'
  },
  {
    companySlug: 'google',
    title: 'Product Manager - Chrome Browser',
    description: 'Lead the product strategy for Chrome browser features used by billions of users. Drive innovation in web technologies and user experience.',
    requirements: 'BA/BS degree. 5+ years of product management experience in consumer technology. Strong analytical skills and experience with A/B testing.',
    responsibilities: 'Define product roadmap, analyze user data, collaborate with engineering teams, conduct user research, and launch new browser features.',
    benefits: 'Competitive compensation, stock options, health insurance, and professional development opportunities.',
    type: 'full_time',
    experienceLevel: 'mid',
    workMode: 'hybrid',
    location: 'Mountain View, CA',
    salaryMin: '160000',
    salaryMax: '220000',
    skills: ['Product Management', 'Data Analysis', 'User Research', 'A/B Testing', 'Web Technologies'],
    status: 'active'
  },
  
  // Microsoft Jobs
  {
    companySlug: 'microsoft',
    title: 'Cloud Solutions Architect - Azure',
    description: 'Help enterprises migrate to Azure cloud platform and design scalable cloud solutions. Work with Fortune 500 companies on their digital transformation journey.',
    requirements: 'Bachelor\'s degree in Computer Science or Engineering. 7+ years of cloud architecture experience. Azure certifications preferred. Strong communication skills.',
    responsibilities: 'Design cloud architectures, lead technical workshops, provide technical guidance to customers, and collaborate with sales teams.',
    benefits: 'Competitive salary, stock awards, comprehensive benefits, flexible work arrangements, and continuous learning opportunities.',
    type: 'full_time',
    experienceLevel: 'senior',
    workMode: 'remote',
    location: 'Remote',
    salaryMin: '150000',
    salaryMax: '200000',
    skills: ['Azure', 'Cloud Architecture', 'DevOps', 'Kubernetes', 'Enterprise Solutions'],
    status: 'active'
  },
  {
    companySlug: 'microsoft',
    title: 'Frontend Developer - Microsoft Teams',
    description: 'Build the future of workplace collaboration with Microsoft Teams. Develop responsive web applications used by millions of professionals worldwide.',
    requirements: 'Bachelor\'s degree in Computer Science. 3+ years of frontend development experience. Strong skills in React, TypeScript, and modern web technologies.',
    responsibilities: 'Develop user interfaces, collaborate with designers, optimize performance, write unit tests, and participate in code reviews.',
    benefits: 'Competitive compensation, healthcare benefits, stock purchase plan, and flexible working hours.',
    type: 'full_time',
    experienceLevel: 'mid',
    workMode: 'hybrid',
    location: 'Redmond, WA',
    salaryMin: '120000',
    salaryMax: '160000',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Web Performance'],
    status: 'active'
  },
  
  // Apple Jobs
  {
    companySlug: 'apple',
    title: 'iOS Software Engineer - iPhone',
    description: 'Join the iPhone software team to create exceptional user experiences on iOS. Work on features that define the future of mobile computing.',
    requirements: 'MS in Computer Science or equivalent experience. 4+ years of iOS development experience. Strong knowledge of Swift, Objective-C, and iOS frameworks.',
    responsibilities: 'Develop iOS applications and frameworks, optimize performance, collaborate with hardware teams, and ensure exceptional user experience.',
    benefits: 'Competitive base salary, stock options, comprehensive health coverage, employee product discounts, and wellness programs.',
    type: 'full_time',
    experienceLevel: 'senior',
    workMode: 'onsite',
    location: 'Cupertino, CA',
    salaryMin: '170000',
    salaryMax: '250000',
    skills: ['Swift', 'Objective-C', 'iOS', 'Xcode', 'Mobile Development'],
    status: 'active'
  },
  
  // Meta Jobs
  {
    companySlug: 'meta',
    title: 'Data Scientist - Instagram Growth',
    description: 'Use data science to drive Instagram\'s growth initiatives. Analyze user behavior, design experiments, and provide insights to product teams.',
    requirements: 'PhD in Statistics, Economics, or related quantitative field preferred. 3+ years of data science experience. Strong skills in SQL, Python, and statistical analysis.',
    responsibilities: 'Conduct statistical analysis, design A/B tests, build predictive models, create data visualizations, and present findings to leadership.',
    benefits: 'Competitive salary, RSU grants, comprehensive benefits, free meals, and wellness stipend.',
    type: 'full_time',
    experienceLevel: 'mid',
    workMode: 'hybrid',
    location: 'Menlo Park, CA',
    salaryMin: '140000',
    salaryMax: '190000',
    skills: ['Python', 'SQL', 'Statistics', 'A/B Testing', 'Data Visualization'],
    status: 'active'
  },
  
  // Amazon Jobs
  {
    companySlug: 'amazon',
    title: 'Software Development Engineer - AWS',
    description: 'Build and scale AWS services that power the world\'s largest cloud platform. Work on distributed systems serving millions of customers globally.',
    requirements: 'Bachelor\'s degree in Computer Science. 3+ years of software development experience. Strong programming skills in Java, Python, or C++. Experience with distributed systems.',
    responsibilities: 'Design and implement scalable services, participate in on-call rotations, optimize system performance, and mentor junior developers.',
    benefits: 'Competitive compensation, stock units, health benefits, career development programs, and relocation assistance.',
    type: 'full_time',
    experienceLevel: 'mid',
    workMode: 'hybrid',
    location: 'Seattle, WA',
    salaryMin: '130000',
    salaryMax: '180000',
    skills: ['Java', 'Python', 'AWS', 'Distributed Systems', 'Microservices'],
    status: 'active'
  },
  
  // Netflix Jobs
  {
    companySlug: 'netflix',
    title: 'Machine Learning Engineer - Recommendation Systems',
    description: 'Build and improve Netflix\'s recommendation algorithms that help 240M+ subscribers discover content they love.',
    requirements: 'MS in Computer Science, Machine Learning, or related field. 4+ years of ML engineering experience. Strong background in recommendation systems and deep learning.',
    responsibilities: 'Develop ML models, optimize recommendation algorithms, conduct online experiments, analyze model performance, and collaborate with content teams.',
    benefits: 'Top-tier compensation, unlimited PTO, stock options, comprehensive health benefits, and access to Netflix content.',
    type: 'full_time',
    experienceLevel: 'senior',
    workMode: 'remote',
    location: 'Los Gatos, CA',
    salaryMin: '200000',
    salaryMax: '300000',
    skills: ['Machine Learning', 'Recommendation Systems', 'Python', 'TensorFlow', 'Scala'],
    status: 'active'
  },
  
  // Tesla Jobs
  {
    companySlug: 'tesla',
    title: 'Autopilot Software Engineer',
    description: 'Develop autonomous driving software for Tesla vehicles. Work on computer vision, neural networks, and real-time systems that make self-driving cars a reality.',
    requirements: 'MS/PhD in Computer Science, Robotics, or related field. Experience with computer vision, deep learning, and autonomous vehicles. Strong C++ and Python skills.',
    responsibilities: 'Implement autonomous driving algorithms, optimize neural network models, test software in simulation and vehicles, and collaborate with hardware teams.',
    benefits: 'Competitive salary, stock options, comprehensive health coverage, free Supercharging, and employee vehicle purchase program.',
    type: 'full_time',
    experienceLevel: 'senior',
    workMode: 'onsite',
    location: 'Palo Alto, CA',
    salaryMin: '160000',
    salaryMax: '240000',
    skills: ['C++', 'Python', 'Computer Vision', 'Deep Learning', 'Autonomous Vehicles'],
    status: 'active'
  },
  
  // SpaceX Jobs
  {
    companySlug: 'spacex',
    title: 'Flight Software Engineer - Starship',
    description: 'Develop flight software for Starship, the next-generation spacecraft designed for missions to Mars. Work on life-critical systems for human spaceflight.',
    requirements: 'BS in Computer Science, Aerospace Engineering, or related field. 3+ years of embedded systems experience. Strong C/C++ programming skills. Security clearance eligible.',
    responsibilities: 'Develop flight control software, implement safety systems, conduct hardware-in-the-loop testing, and support launch operations.',
    benefits: 'Competitive salary, stock options, comprehensive medical coverage, and opportunity to contribute to Mars colonization.',
    type: 'full_time',
    experienceLevel: 'mid',
    workMode: 'onsite',
    location: 'Hawthorne, CA',
    salaryMin: '120000',
    salaryMax: '170000',
    skills: ['C/C++', 'Embedded Systems', 'Real-time Systems', 'Aerospace', 'Safety Critical Systems'],
    status: 'active'
  },
  
  // Spotify Jobs
  {
    companySlug: 'spotify',
    title: 'Product Designer - Mobile Experience',
    description: 'Design delightful user experiences for Spotify\'s mobile apps used by hundreds of millions of music lovers worldwide.',
    requirements: 'Bachelor\'s degree in Design or related field. 4+ years of product design experience. Strong portfolio showcasing mobile design work. Proficiency in Figma and prototyping tools.',
    responsibilities: 'Create user-centered designs, conduct user research, build interactive prototypes, collaborate with cross-functional teams, and iterate based on data and feedback.',
    benefits: 'Competitive salary, equity compensation, flexible work arrangements, Spotify Premium, and wellness allowance.',
    type: 'full_time',
    experienceLevel: 'mid',
    workMode: 'remote',
    location: 'Stockholm, Sweden',
    salaryMin: '90000',
    salaryMax: '130000',
    skills: ['Product Design', 'UX/UI Design', 'Figma', 'Prototyping', 'User Research'],
    status: 'active'
  },
  
  // Airbnb Jobs
  {
    companySlug: 'airbnb',
    title: 'Fullstack Engineer - Host Platform',
    description: 'Build tools and experiences for Airbnb hosts to manage their properties and provide exceptional guest experiences.',
    requirements: 'Bachelor\'s degree in Computer Science. 3+ years of fullstack development experience. Strong skills in React, Node.js, and database design.',
    responsibilities: 'Develop web applications, build APIs, optimize database queries, implement new features, and ensure scalable architecture.',
    benefits: 'Competitive compensation, annual travel stipend, equity grants, comprehensive health benefits, and flexible work arrangements.',
    type: 'full_time',
    experienceLevel: 'mid',
    workMode: 'hybrid',
    location: 'San Francisco, CA',
    salaryMin: '140000',
    salaryMax: '190000',
    skills: ['React', 'Node.js', 'JavaScript', 'PostgreSQL', 'REST APIs'],
    status: 'active'
  },
  
  // Uber Jobs
  {
    companySlug: 'uber',
    title: 'Security Engineer - Platform Security',
    description: 'Protect Uber\'s platform and user data from security threats. Build security tools and implement security best practices across the organization.',
    requirements: 'Bachelor\'s degree in Computer Science or Cybersecurity. 4+ years of security engineering experience. Knowledge of cloud security, threat modeling, and incident response.',
    responsibilities: 'Conduct security assessments, build security automation tools, respond to security incidents, and educate engineering teams on security practices.',
    benefits: 'Competitive salary, stock options, comprehensive health coverage, commuter benefits, and professional development budget.',
    type: 'full_time',
    experienceLevel: 'senior',
    workMode: 'hybrid',
    location: 'San Francisco, CA',
    salaryMin: '150000',
    salaryMax: '210000',
    skills: ['Cybersecurity', 'Cloud Security', 'Python', 'Incident Response', 'Security Automation'],
    status: 'active'
  },
  
  // Stripe Jobs
  {
    companySlug: 'stripe',
    title: 'Backend Engineer - Payments Infrastructure',
    description: 'Build the infrastructure that powers payments for millions of businesses worldwide. Work on high-scale, reliable payment systems.',
    requirements: 'Bachelor\'s degree in Computer Science. 3+ years of backend development experience. Strong knowledge of distributed systems, databases, and API design.',
    responsibilities: 'Design and implement payment APIs, optimize system performance, ensure data consistency, handle high transaction volumes, and maintain system reliability.',
    benefits: 'Competitive compensation, equity grants, comprehensive benefits, remote work flexibility, and home office setup budget.',
    type: 'full_time',
    experienceLevel: 'mid',
    workMode: 'remote',
    location: 'Remote',
    salaryMin: '140000',
    salaryMax: '180000',
    skills: ['Ruby', 'Go', 'PostgreSQL', 'Redis', 'Distributed Systems'],
    status: 'active'
  }
];

async function seedRealisticData() {
  console.log('🌱 Starting realistic data seeding...');
  
  try {
    // Get the existing employer user
    const existingEmployer = await db
      .select()
      .from(users)
      .where(eq(users.email, 'employer@example.com'))
      .limit(1);

    if (existingEmployer.length === 0) {
      throw new Error('Employer user not found. Please run the basic seed first.');
    }

    const employer = existingEmployer[0];

    // Seed companies
    console.log('📊 Seeding companies...');
    const companyMap = new Map();
    
    for (const companyData of realCompanies) {
      // Check if company already exists
      const existingCompany = await db
        .select()
        .from(companies)
        .where(eq(companies.slug, companyData.slug))
        .limit(1);

      if (existingCompany.length === 0) {
        const [newCompany] = await db
          .insert(companies)
          .values({
            name: companyData.name,
            slug: companyData.slug,
            description: companyData.description,
            website: companyData.website,
            industry: companyData.industry,
            size: companyData.size,
            location: companyData.location,
            foundedYear: companyData.foundedYear,
            logo: companyData.logo,
            ownerId: employer.id,
            benefits: companyData.benefits,
          })
          .returning();
        
        companyMap.set(companyData.slug, newCompany.id);
        console.log(`✓ Created company: ${companyData.name}`);
      } else {
        companyMap.set(companyData.slug, existingCompany[0].id);
        console.log(`✓ Company already exists: ${companyData.name}`);
      }
    }

    // Seed jobs
    console.log('💼 Seeding jobs...');
    
    for (const jobData of realJobs) {
      const companyId = companyMap.get(jobData.companySlug);
      if (!companyId) {
        console.log(`⚠️  Company not found for slug: ${jobData.companySlug}`);
        continue;
      }

      // Generate unique slug
      const jobSlug = `${jobData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

      try {
        const [newJob] = await db
          .insert(jobs)
          .values({
            title: jobData.title,
            slug: jobSlug,
            description: jobData.description,
            requirements: jobData.requirements,
            responsibilities: jobData.responsibilities,
            benefits: jobData.benefits,
            companyId: companyId,
            type: jobData.type as any,
            experienceLevel: jobData.experienceLevel as any,
            workMode: jobData.workMode as any,
            location: jobData.location,
            salaryMin: jobData.salaryMin,
            salaryMax: jobData.salaryMax,
            currency: 'USD',
            skills: jobData.skills,
            status: jobData.status as any,
            createdById: employer.id,
            viewCount: Math.floor(Math.random() * 1000) + 50,
            applicationCount: Math.floor(Math.random() * 50) + 5,
            applicationDeadline: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) // 30 days from now
          })
          .returning();

        console.log(`✓ Created job: ${jobData.title} at ${companyData.name}`);
      } catch (error) {
        console.error(`✗ Failed to create job: ${jobData.title}`, error);
      }
    }

    console.log(`\n🎉 Realistic data seeding completed successfully!`);
    console.log(`📊 Added ${realCompanies.length} companies`);
    console.log(`💼 Added ${realJobs.length} job postings`);
    
    console.log(`\n🔗 Test the results:`);
    console.log(`🏠 Jobs Page: http://localhost:3000/jobs`);
    console.log(`🏢 Companies Page: http://localhost:3000/companies`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

if (require.main === module) {
  seedRealisticData()
    .then(() => {
      console.log('✅ Seeding process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedRealisticData };