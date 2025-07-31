import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Edit, Eye, Trash2, MoreVertical, Users, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default async function EmployerJobsPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  if (user.role !== 'employer') {
    redirect('/dashboard');
  }

  // Mock jobs data - replace with real data from database
  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      status: 'active',
      type: 'Full-time',
      workMode: 'Remote',
      salaryMin: 120000,
      salaryMax: 160000,
      applications: 23,
      views: 456,
      postedAt: '2024-01-15',
      expiresAt: '2024-02-15'
    },
    {
      id: 2,
      title: 'Product Manager',
      status: 'paused',
      type: 'Full-time',
      workMode: 'Hybrid',
      salaryMin: 100000,
      salaryMax: 140000,
      applications: 18,
      views: 321,
      postedAt: '2024-01-10',
      expiresAt: '2024-02-10'
    },
    {
      id: 3,
      title: 'UX Designer',
      status: 'draft',
      type: 'Contract',
      workMode: 'Remote',
      salaryMin: 80000,
      salaryMax: 110000,
      applications: 0,
      views: 0,
      postedAt: null,
      expiresAt: null
    },
    {
      id: 4,
      title: 'Data Scientist',
      status: 'closed',
      type: 'Full-time',
      workMode: 'Onsite',
      salaryMin: 110000,
      salaryMax: 150000,
      applications: 47,
      views: 892,
      postedAt: '2023-12-20',
      expiresAt: '2024-01-20'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Temporary debug component - remove after testing */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600 mt-1">
            Manage your job postings and track applications
          </p>
        </div>
        <Link href="/dashboard/employer/jobs/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">
            {jobs.filter(job => job.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active Jobs</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">
            {jobs.reduce((sum, job) => sum + job.applications, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">
            {jobs.reduce((sum, job) => sum + job.views, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Views</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">
            {jobs.filter(job => job.status === 'draft').length}
          </div>
          <div className="text-sm text-gray-600">Draft Jobs</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Jobs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Job Title</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Salary</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Applications</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Views</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Posted</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.workMode}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={`capitalize ${getStatusColor(job.status)}`}>
                      {job.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{job.type}</td>
                  <td className="py-4 px-6 text-gray-600">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {job.applications}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-gray-600">
                      <Eye className="h-4 w-4 mr-1" />
                      {job.views}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-600">
                      <div className="text-sm">{formatDate(job.postedAt)}</div>
                      {job.expiresAt && (
                        <div className="text-xs text-gray-500">
                          Expires: {formatDate(job.expiresAt)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link href={`/jobs/${job.id}`} className="flex items-center w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View Job
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/dashboard/employer/jobs/${job.id}/edit`} className="flex items-center w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Job
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/dashboard/employer/jobs/${job.id}/applications`} className="flex items-center w-full">
                            <Users className="h-4 w-4 mr-2" />
                            View Applications ({job.applications})
                          </Link>
                        </DropdownMenuItem>
                        {job.status === 'active' && (
                          <DropdownMenuItem>
                            <button className="flex items-center w-full text-yellow-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              Pause Job
                            </button>
                          </DropdownMenuItem>
                        )}
                        {job.status === 'paused' && (
                          <DropdownMenuItem>
                            <button className="flex items-center w-full text-green-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              Activate Job
                            </button>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <button className="flex items-center w-full text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Job
                          </button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {jobs.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
          <p className="text-gray-600 mb-6">Start by posting your first job to attract talented candidates</p>
          <Link href="/dashboard/employer/jobs/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Post Your First Job
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}