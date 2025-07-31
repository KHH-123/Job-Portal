import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, Users, Eye, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function EmployerDashboard() {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  if (user.role !== 'employer') {
    redirect('/dashboard');
  }

  // Mock data - replace with real data from database
  const stats = {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 156,
    totalViews: 2340
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your job postings and find the perfect candidates
          </p>
        </div>
        <Link href="/dashboard/employer/jobs/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              <p className="text-gray-600 text-sm">Total Jobs</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              <p className="text-gray-600 text-sm">Active Jobs</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              <p className="text-gray-600 text-sm">Applications</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <Eye className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              <p className="text-gray-600 text-sm">Profile Views</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/dashboard/employer/jobs/new">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Post a New Job
              </Button>
            </Link>
            <Link href="/dashboard/employer/jobs">
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="h-4 w-4 mr-2" />
                Manage Jobs
              </Button>
            </Link>
            <Link href="/dashboard/employer/applications">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View Applications
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">New application for Senior Developer</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Job posting "UX Designer" published</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-gray-600">5 new profile views today</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Profile</h3>
          <p className="text-gray-600 text-sm mb-4">
            Complete your company profile to attract better candidates
          </p>
          <Link href="/dashboard/employer/company">
            <Button variant="outline" className="w-full">
              Update Profile
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}