import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, Download, Eye, MessageCircle, Calendar, Star, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

export default async function EmployerApplicationsPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  if (user.role !== 'employer') {
    redirect('/dashboard');
  }

  // Mock applications data - replace with real data from database
  const applications = [
    {
      id: 1,
      jobTitle: 'Senior Frontend Developer',
      jobId: 1,
      candidate: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        avatar: 'https://placehold.co/40x40/6366f1/ffffff?text=SJ',
        title: 'Frontend Developer',
        experience: '5 years',
        location: 'San Francisco, CA'
      },
      status: 'pending',
      appliedAt: '2024-01-20',
      coverLetter: 'I am excited to apply for the Senior Frontend Developer position...',
      resume: '/resumes/sarah-johnson.pdf',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      rating: null
    },
    {
      id: 2,
      jobTitle: 'Senior Frontend Developer',
      jobId: 1,
      candidate: {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        avatar: 'https://placehold.co/40x40/10b981/ffffff?text=MC',
        title: 'Full Stack Developer',
        experience: '6 years',
        location: 'Remote'
      },
      status: 'reviewed',
      appliedAt: '2024-01-18',
      coverLetter: 'With over 6 years of experience in full-stack development...',
      resume: '/resumes/michael-chen.pdf',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      rating: 4
    },
    {
      id: 3,
      jobTitle: 'Product Manager',
      jobId: 2,
      candidate: {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        avatar: 'https://placehold.co/40x40/f59e0b/ffffff?text=ER',
        title: 'Senior Product Manager',
        experience: '7 years',
        location: 'New York, NY'
      },
      status: 'interview',
      appliedAt: '2024-01-15',
      coverLetter: 'I have been following your company for years and am thrilled...',
      resume: '/resumes/emily-rodriguez.pdf',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
      rating: 5
    },
    {
      id: 4,
      jobTitle: 'Product Manager',
      jobId: 2,
      candidate: {
        name: 'David Kim',
        email: 'david.kim@email.com',
        avatar: 'https://placehold.co/40x40/8b5cf6/ffffff?text=DK',
        title: 'Associate Product Manager',
        experience: '3 years',
        location: 'Seattle, WA'
      },
      status: 'rejected',
      appliedAt: '2024-01-12',
      coverLetter: 'I am passionate about building products that users love...',
      resume: '/resumes/david-kim.pdf',
      skills: ['Product Management', 'Data Analysis', 'Wireframing'],
      rating: 2
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'reviewed': return '👀';
      case 'interview': return '🎯';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '📄';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderRating = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Group applications by status for stats
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">
            Review and manage job applications from candidates
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.reviewed || 0}</div>
          <div className="text-sm text-gray-600">Reviewed</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">{statusCounts.interview || 0}</div>
          <div className="text-sm text-gray-600">In Interview</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{statusCounts.accepted || 0}</div>
          <div className="text-sm text-gray-600">Accepted</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search candidates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            <SelectItem value="1">Senior Frontend Developer</SelectItem>
            <SelectItem value="2">Product Manager</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Candidate Avatar */}
                <Avatar className="w-12 h-12">
                  <AvatarImage src={application.candidate.avatar} alt={application.candidate.name} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                
                {/* Candidate Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.candidate.name}
                      </h3>
                      <p className="text-gray-600">{application.candidate.title}</p>
                      <p className="text-sm text-gray-500">
                        {application.candidate.experience} • {application.candidate.location}
                      </p>
                    </div>
                    
                    {/* Status and Rating */}
                    <div className="flex items-center space-x-3">
                      {application.rating && renderRating(application.rating)}
                      <Badge className={`${getStatusColor(application.status)} capitalize`}>
                        {getStatusIcon(application.status)} {application.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Job Applied For */}
                  <div className="mt-2">
                    <Link href={`/jobs/${application.jobId}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {application.jobTitle}
                    </Link>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {application.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {application.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{application.skills.length - 4} more
                      </Badge>
                    )}
                  </div>

                  {/* Cover Letter Preview */}
                  <p className="text-gray-600 mt-3 line-clamp-2">
                    {application.coverLetter}
                  </p>

                  {/* Actions and Meta */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied {formatDate(application.appliedAt)}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Link href={`/dashboard/employer/applications/${application.id}`}>
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {applications.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-6">
            Applications will appear here once candidates start applying to your jobs
          </p>
          <Link href="/dashboard/employer/jobs/new">
            <Button>Post a Job to Get Started</Button>
          </Link>
        </Card>
      )}

      {/* Pagination */}
      {applications.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button className="bg-blue-600 text-white">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}