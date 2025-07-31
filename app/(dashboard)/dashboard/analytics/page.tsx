'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from '@/lib/db/schema';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  FileText, 
  Eye, 
  CheckCircle, 
  Clock,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface JobSeekerAnalytics {
  applicationStats: Record<string, number>;
  applicationTimeline: Array<{ date: string; count: number }>;
  recentActivity: Array<{ id: string; action: string; timestamp: string; metadata: any }>;
  totalApplications: number;
  acceptedApplications: number;
  successRate: number;
  averageResponseTime: number;
}

interface EmployerAnalytics {
  jobStats: Record<string, number>;
  applicationsReceived: Array<{ date: string; count: number }>;
  jobViewsData: Array<{ date: string; count: number }>;
  topJobs: Array<{ id: string; title: string; applicationCount: number; viewCount: number; createdAt: string }>;
  applicationStatusBreakdown: Record<string, number>;
  recentActivity: Array<{ id: string; action: string; timestamp: string; metadata: any }>;
  totalViews: number;
  totalApplicationsReceived: number;
  conversionRate: number;
}

function JobSeekerDashboard({ analytics }: { analytics: JobSeekerAnalytics }) {
  // Transform application timeline data for charts
  const timelineData = analytics.applicationTimeline.map(item => ({
    date: format(parseISO(item.date), 'MMM dd'),
    applications: item.count
  }));

  // Transform application stats for pie chart
  const statusData = Object.entries(analytics.applicationStats).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: getStatusColor(status)
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.acceptedApplications} accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Application acceptance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Days to hear back
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.applicationStats.pending || 0) + (analytics.applicationStats.reviewing || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending + Under Review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Application Timeline (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={timelineData}
              xKey="date"
              yKey="applications"
              color="#3b82f6"
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Application Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={statusData}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.length > 0 ? (
              analytics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.action.split('_')[0]}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Start applying to jobs to see your activity here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmployerDashboard({ analytics }: { analytics: EmployerAnalytics }) {
  // Transform applications received data for charts
  const applicationsData = analytics.applicationsReceived.map(item => ({
    date: format(parseISO(item.date), 'MMM dd'),
    applications: item.count
  }));

  // Transform job views data for charts
  const viewsData = analytics.jobViewsData.map(item => ({
    date: format(parseISO(item.date), 'MMM dd'),
    views: item.count
  }));

  // Transform application status breakdown for pie chart
  const statusData = Object.entries(analytics.applicationStatusBreakdown).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: getStatusColor(status)
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Job listing views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Received</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalApplicationsReceived}</div>
            <p className="text-xs text-muted-foreground">
              From all job postings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Views to applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.jobStats.open || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently accepting applications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Applications Received (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={applicationsData}
              xKey="date"
              yKey="applications"
              color="#10b981"
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Job Views (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={viewsData}
              xKey="date"
              yKey="views"
              color="#f59e0b"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Application Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={statusData}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topJobs.length > 0 ? (
                analytics.topJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Posted {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-medium">{job.viewCount}</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{job.applicationCount}</p>
                        <p className="text-xs text-muted-foreground">Apps</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No jobs posted yet</p>
                  <p className="text-sm">Start posting jobs to see performance metrics</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: '#f59e0b',
    reviewing: '#3b82f6', 
    accepted: '#10b981',
    rejected: '#ef4444',
    withdrawn: '#6b7280',
    open: '#10b981',
    closed: '#ef4444',
    draft: '#6b7280'
  };
  return colors[status] || '#6b7280';
}

export default function AnalyticsPage() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const [analytics, setAnalytics] = useState<JobSeekerAnalytics | EmployerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user) return;

      try {
        setLoading(true);
        const endpoint = user.role === 'job_seeker' 
          ? '/api/analytics/job-seeker' 
          : '/api/analytics/employer';
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <BarChart3 className="h-12 w-12 mx-auto opacity-50" />
          </div>
          <p className="text-red-600 font-medium">Error loading analytics</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          {user.role === 'job_seeker' 
            ? 'Track your job search progress and application performance'
            : 'Monitor your job postings and recruitment metrics'
          }
        </p>
      </div>

      {analytics && (
        user.role === 'job_seeker' 
          ? <JobSeekerDashboard analytics={analytics as JobSeekerAnalytics} />
          : <EmployerDashboard analytics={analytics as EmployerAnalytics} />
      )}
    </div>
  );
}