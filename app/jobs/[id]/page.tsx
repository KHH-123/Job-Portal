import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUser } from '@/lib/db/queries';
import { ApplicationFormWrapper } from '@/components/applications/ApplicationFormWrapper';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Users, 
  Calendar, 
  ArrowLeft, 
  Heart, 
  Share2,
  Briefcase,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// Mock job data - replace with real API call
const mockJob = {
  id: 1,
  title: 'Senior Frontend Developer',
  company: 'TechCorp Inc.',
  location: 'San Francisco, CA',
  type: 'Full-time',
  workMode: 'Remote',
  experienceLevel: 'Senior',
  salaryMin: 120000,
  salaryMax: 160000,
  currency: 'USD',
  description: `We are looking for a Senior Frontend Developer to join our dynamic team and help build the next generation of our web applications. You'll work closely with our design and backend teams to create exceptional user experiences.

As a Senior Frontend Developer, you will be responsible for developing high-quality, scalable, and maintainable frontend solutions using modern technologies including React, TypeScript, and Next.js.

This is an excellent opportunity for someone who is passionate about frontend development and wants to make a significant impact in a fast-growing company.`,
  requirements: [
    '5+ years of experience in frontend development',
    'Expert knowledge of React and TypeScript',
    'Experience with Next.js and modern build tools',
    'Strong understanding of responsive design principles',
    'Experience with state management libraries (Redux, Zustand)',
    'Knowledge of testing frameworks (Jest, Cypress)',
    'Experience with Git and collaborative development workflows'
  ],
  responsibilities: [
    'Develop and maintain high-quality frontend applications',
    'Collaborate with designers to implement pixel-perfect UIs',
    'Write clean, maintainable, and well-tested code',
    'Participate in code reviews and provide constructive feedback',
    'Mentor junior developers and contribute to team growth',
    'Stay up-to-date with latest frontend technologies and best practices'
  ],
  benefits: [
    'Competitive salary and equity package',
    'Comprehensive health insurance',
    'Flexible work arrangements',
    '$2,000 annual learning budget',
    'Top-tier equipment and workspace',
    'Unlimited PTO policy',
    'Team retreats and company events'
  ],
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Jest', 'Cypress'],
  postedAt: '2 days ago',
  applicationDeadline: '2024-02-15',
  applicants: 42,
  logo: 'https://placehold.co/80x80/3b82f6/ffffff?text=TC',
  companyInfo: {
    name: 'TechCorp Inc.',
    description: 'TechCorp is a leading technology company focused on building innovative solutions for modern businesses.',
    size: '100-500 employees',
    industry: 'Technology',
    website: 'https://techcorp.com',
    founded: 2018
  }
};

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  const jobId = parseInt(id);
  
  // In a real app, you would fetch the job data from the database
  // For now, we'll use the mock data

  // Check if user has already applied (in real app, check database)
  const hasApplied = false; // This should be fetched from the database
  const isSaved = false; // This should be fetched from the database

  const formatSalary = (min: number, max: number, currency: string) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/jobs">
            <Button
              variant="ghost"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <Card className="p-6 mb-6">
              <div className="flex items-start space-x-4">
                <img
                  src={mockJob.logo}
                  alt={`${mockJob.company} logo`}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {mockJob.title}
                  </h1>
                  <div className="flex items-center text-lg text-gray-600 mb-4">
                    <Building className="h-5 w-5 mr-2" />
                    <Link href={`/companies/${mockJob.company}`} className="hover:text-blue-600">
                      {mockJob.company}
                    </Link>
                  </div>
                  
                  {/* Job Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {mockJob.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {mockJob.type}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {mockJob.workMode}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatSalary(mockJob.salaryMin, mockJob.salaryMax, mockJob.currency)}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {mockJob.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Job Description */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                {mockJob.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            {/* Requirements */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {mockJob.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Responsibilities */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="space-y-2">
                {mockJob.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span className="text-gray-600">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Benefits */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
              <ul className="space-y-2">
                {mockJob.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Application Form - Client Component */}
            <ApplicationFormWrapper 
              jobId={jobId}
              jobTitle={mockJob.title}
              companyName={mockJob.company}
              hasApplied={hasApplied}
              user={user}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Apply Card */}
            <Card className="p-6 mb-6 sticky top-6">
              <div className="space-y-4">
                {user && user.role === 'job_seeker' ? (
                  !hasApplied ? (
                    <Button size="lg" className="w-full">
                      Apply Now
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Applied
                    </Button>
                  )
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      {!user ? 'Sign in to apply for this job' : 'Only job seekers can apply'}
                    </p>
                    {!user && (
                      <Button size="lg" className="w-full" asChild>
                        <a href="/sign-in">Sign In to Apply</a>
                      </Button>
                    )}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Job Info */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience Level:</span>
                  <span className="font-medium">{mockJob.experienceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium">{mockJob.postedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applicants:</span>
                  <span className="font-medium">{mockJob.applicants} applied</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-medium">
                    {new Date(mockJob.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Company Info */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={mockJob.logo}
                    alt={`${mockJob.company} logo`}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{mockJob.companyInfo.name}</h4>
                    <p className="text-sm text-gray-600">{mockJob.companyInfo.industry}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{mockJob.companyInfo.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{mockJob.companyInfo.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded:</span>
                    <span className="font-medium">{mockJob.companyInfo.founded}</span>
                  </div>
                </div>
                
                <Link href={`/companies/${mockJob.company}`}>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View Company Profile
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Similar Jobs */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
              <div className="space-y-3">
                {[
                  { title: 'Frontend Developer', company: 'StartupXYZ', salary: '$90k - $120k' },
                  { title: 'React Developer', company: 'WebCorp', salary: '$100k - $130k' },
                  { title: 'Full Stack Developer', company: 'DevStudio', salary: '$110k - $140k' }
                ].map((job, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium text-gray-900 text-sm">{job.title}</h4>
                    <p className="text-xs text-gray-600">{job.company}</p>
                    <p className="text-xs text-blue-600 font-medium">{job.salary}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}