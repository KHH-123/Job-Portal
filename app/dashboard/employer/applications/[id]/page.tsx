import { getUser } from '@/lib/db/queries';
import { redirect, notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  User,
  Star,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { ApplicationStatusUpdate } from '@/components/applications/ApplicationStatusUpdate';

// Mock application data - replace with real database query
const mockApplication = {
  id: 1,
  status: 'pending',
  appliedAt: '2024-01-20T10:00:00Z',
  reviewedAt: null,
  coverLetter: `Dear Hiring Manager,

I am excited to apply for the Senior Frontend Developer position at TechCorp Inc. With over 5 years of experience in React, TypeScript, and modern web development, I believe I would be a valuable addition to your team.

In my current role at StartupXYZ, I have successfully:
- Led the development of a customer-facing dashboard using React and Next.js, improving user engagement by 40%
- Implemented a comprehensive testing strategy using Jest and Cypress, reducing bugs by 60%
- Mentored 3 junior developers and established code review processes
- Optimized application performance, reducing load times by 50%

I am particularly drawn to TechCorp's commitment to innovation and your focus on creating exceptional user experiences. Your recent work on the AI-powered analytics platform aligns perfectly with my passion for cutting-edge technology.

I would welcome the opportunity to discuss how my skills and experience can contribute to your team's success. Thank you for considering my application.

Best regards,
Sarah Johnson`,
  notes: null,
  job: {
    id: 1,
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    type: 'Full-time',
    workMode: 'Remote'
  },
  candidate: {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    avatar: 'https://placehold.co/120x120/6366f1/ffffff?text=SJ',
    title: 'Senior Frontend Developer',
    experience: '5+ years',
    expectedSalary: 140000,
    portfolio: 'https://sarahjohnson.dev',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    githubUrl: 'https://github.com/sarahjohnson',
    resume: '/resumes/sarah-johnson.pdf',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Python'],
    rating: null
  }
};

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  if (user.role !== 'employer') {
    redirect('/dashboard');
  }

  const applicationId = parseInt(id);
  
  // In a real app, fetch the application from database
  // const application = await getApplicationById(applicationId);
  // if (!application) notFound();
  
  const application = mockApplication;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not reviewed';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/employer/applications">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600 mt-1">
              {application.job.title} • Applied {formatDate(application.appliedAt)}
            </p>
          </div>
        </div>
        
        <Badge className={`${getStatusColor(application.status)} capitalize px-3 py-1`}>
          {application.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Profile */}
          <Card className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={application.candidate.avatar} alt={application.candidate.name} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{application.candidate.name}</h2>
                    <p className="text-lg text-gray-600">{application.candidate.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{application.candidate.experience} experience</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {application.candidate.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{application.candidate.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${application.candidate.email}`} className="hover:text-blue-600">
                      {application.candidate.email}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <a href={`tel:${application.candidate.phone}`} className="hover:text-blue-600">
                      {application.candidate.phone}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {application.candidate.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium">Expected Salary:</span>
                    <span className="ml-2">${application.candidate.expectedSalary.toLocaleString()}/year</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {application.candidate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex items-center space-x-4 mt-4">
                  <a
                    href={application.candidate.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Resume
                  </a>
                  <a
                    href={application.candidate.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Portfolio
                  </a>
                  <a
                    href={application.candidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    LinkedIn
                  </a>
                  <a
                    href={application.candidate.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {/* Cover Letter */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h3>
            <div className="prose prose-gray max-w-none">
              {application.coverLetter.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>

          {/* Internal Notes */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes</h3>
            {application.notes ? (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600">{application.notes}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No internal notes yet.</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </Card>

            {/* Application Status */}
            <ApplicationStatusUpdate
              applicationId={application.id}
              currentStatus={application.status}
              currentNotes={application.notes || ''}
            />

            {/* Application Timeline */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                    <p className="text-xs text-gray-500">{formatDate(application.appliedAt)}</p>
                  </div>
                </div>
                
                {application.reviewedAt && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Application Reviewed</p>
                      <p className="text-xs text-gray-500">{formatDate(application.reviewedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Job Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Position:</span>
                  <p className="text-gray-600">{application.job.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Location:</span>
                  <p className="text-gray-600">{application.job.location}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Type:</span>
                  <p className="text-gray-600">{application.job.type}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Work Mode:</span>
                  <p className="text-gray-600">{application.job.workMode}</p>
                </div>
              </div>
              
              <Link href={`/jobs/${application.job.id}`} className="block mt-4">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Job Posting
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}