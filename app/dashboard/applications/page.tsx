import { getUserApplications } from '@/app/actions/applications';
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageCircle, 
  Calendar,
  MapPin,
  Building,
  DollarSign,
  Search,
  Filter,
  ArrowUpRight,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { WithdrawApplicationButton } from '@/components/applications/WithdrawApplicationButton';

export default async function ApplicationsPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  if (user.role !== 'job_seeker') {
    redirect('/dashboard');
  }

  const applications = await getUserApplications();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'reviewing':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'interview':
        return <MessageCircle className="h-4 w-4 text-purple-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
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

  const formatSalary = (min: number | null, max: number | null, currency = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    if (!min) return `Up to $${(max! / 1000).toFixed(0)}k`;
    if (!max) return `From $${(min / 1000).toFixed(0)}k`;
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Group applications by status
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">
            Track the status of your job applications
          </p>
        </div>
        <Link href="/jobs">
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Find More Jobs
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.Reviewed || 0}</div>
          <div className="text-sm text-gray-600">Reviewed</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">{statusCounts.interview || 0}</div>
          <div className="text-sm text-gray-600">Interviews</div>
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
        {applications.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6">
              Start applying to jobs to track your applications here
            </p>
            <Link href="/jobs">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
            </Link>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Company Logo */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {application.companyLogo ? (
                      <img
                        src={application.companyLogo}
                        alt={`${application.companyName} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Application Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/jobs/${application.jobId}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                            {application.jobTitle}
                          </h3>
                        </Link>
                        <p className="text-gray-600 font-medium">{application.companyName}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {application.jobLocation || 'Remote'}
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="text-xs">
                              {application.jobType}
                            </Badge>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="text-xs">
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex items-center space-x-3">
                        <Badge className={`flex items-center gap-1 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="capitalize">{application.status}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center mt-3 text-sm">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {application.salary || "Salary not specified"}
                      </span>
                    </div>

                    {/* Application Timeline */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Applied {formatDate(application.appliedAt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link href={`/jobs/${application.jobId}`}>
                          <Button variant="outline" size="sm">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            View Job
                          </Button>
                        </Link>
                        
                        {(application.status === 'pending' || application.status === 'reviewing') && (
                          <WithdrawApplicationButton 
                            applicationId={application.id}
                            jobTitle={application.jobTitle}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

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