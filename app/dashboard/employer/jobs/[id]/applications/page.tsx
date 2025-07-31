import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  Search, 
  User, 
  Mail, 
  Calendar,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Application {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  appliedAt: string;
  coverLetter: string;
  resume?: string;
  experience: string;
  skills: string[];
}

export default async function JobApplicationsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  if (user.role !== 'employer') {
    redirect('/dashboard');
  }

  // Mock data - replace with real database query
  const job = {
    id: id,
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    location: 'Remote',
    type: 'Full-time',
    status: 'active',
    totalApplications: 23
  };

  const applications: Application[] = [
    {
      id: '1',
      user: {
        name: 'John Smith',
        email: 'john.smith@email.com'
      },
      status: 'pending',
      appliedAt: '2024-01-20T10:00:00Z',
      coverLetter: 'I am excited to apply for this position. With 5+ years of experience in React and TypeScript, I believe I would be a great fit for your team.',
      experience: '5+ years',
      skills: ['React', 'TypeScript', 'Next.js', 'Node.js']
    },
    {
      id: '2',
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com'
      },
      status: 'reviewed',
      appliedAt: '2024-01-19T14:30:00Z',
      coverLetter: 'I have been following your company for a while and I am impressed by your innovative approach to web development.',
      experience: '7+ years',
      skills: ['React', 'Vue.js', 'GraphQL', 'AWS']
    },
    {
      id: '3',
      user: {
        name: 'Mike Chen',
        email: 'mike.chen@email.com'
      },
      status: 'interview',
      appliedAt: '2024-01-18T09:15:00Z',
      coverLetter: 'My background in both frontend and backend development would allow me to contribute to your full-stack projects.',
      experience: '4+ years',
      skills: ['React', 'Python', 'Django', 'PostgreSQL']
    },
    {
      id: '4',
      user: {
        name: 'Emily Davis',
        email: 'emily.davis@email.com'
      },
      status: 'accepted',
      appliedAt: '2024-01-17T16:45:00Z',
      coverLetter: 'I am passionate about creating user-friendly interfaces and have extensive experience with modern frontend frameworks.',
      experience: '6+ years',
      skills: ['React', 'Angular', 'TypeScript', 'Sass']
    },
    {
      id: '5',
      user: {
        name: 'David Wilson',
        email: 'david.wilson@email.com'
      },
      status: 'rejected',
      appliedAt: '2024-01-16T11:20:00Z',
      coverLetter: 'While I am early in my career, I am eager to learn and contribute to your team.',
      experience: '1+ years',
      skills: ['HTML', 'CSS', 'JavaScript', 'React']
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
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'interview': return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'reviewed': return <Eye className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/employer/jobs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Applications for {job.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {job.company} • {job.location} • {job.type}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href={`/jobs/${job.id}`}>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Job Posting
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">
            {applications.length}
          </div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {statusCounts.pending || 0}
          </div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {statusCounts.interview || 0}
          </div>
          <div className="text-sm text-gray-600">In Interview</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {statusCounts.accepted || 0}
          </div>
          <div className="text-sm text-gray-600">Accepted</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">
            {statusCounts.rejected || 0}
          </div>
          <div className="text-sm text-gray-600">Rejected</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search applications..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter by Status
        </Button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.user.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <Badge className={`capitalize ${getStatusColor(application.status)}`}>
                        {application.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {application.user.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                    </div>
                    <div>
                      Experience: {application.experience}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-700 line-clamp-2">
                      {application.coverLetter}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {application.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/employer/applications/${application.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                      {application.resume && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Resume
                        </Button>
                      )}
                    </div>
                    
                    {application.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          Reject
                        </Button>
                      </div>
                    )}
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
            Applications will appear here once candidates start applying to your job posting.
          </p>
          <Link href={`/jobs/${job.id}`}>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Job Posting
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}