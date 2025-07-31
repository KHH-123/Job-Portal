'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/lib/db/schema';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { 
  Calendar,
  Download, 
  TrendingUp, 
  Users, 
  Briefcase, 
  FileText, 
  Eye, 
  CheckCircle, 
  Clock,
  Target,
  BarChart3,
  Activity,
  Filter,
  RefreshCw,
  Zap,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';
import { format, subDays, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type DateRange = '7d' | '30d' | '90d' | '6m' | '1y';
type ReportType = 'overview' | 'performance' | 'trends' | 'comparative';

interface ReportsData {
  timeline: Array<{ date: string; applications: number; views: number; jobs?: number }>;
  comparison: {
    current: { applications: number; views: number; jobs?: number; successRate?: number };
    previous: { applications: number; views: number; jobs?: number; successRate?: number };
    percentageChange: { applications: number; views: number; jobs?: number; successRate?: number };
  };
  categoryBreakdown: Array<{ name: string; value: number; color?: string }>;
  predictiveAnalytics: {
    nextMonthProjection: number;
    trendDirection: 'up' | 'down' | 'stable';
    confidence: number;
  };
  detailedMetrics: {
    averageTimeToHire?: number;
    topPerformingJobs?: Array<{ title: string; applications: number; successRate: number }>;
    candidateEngagement?: {
      profileViews: number;
      messagesSent: number;
      responseRate: number;
    };
  };
}

function ReportFilters({ 
  dateRange, 
  setDateRange, 
  reportType, 
  setReportType,
  onRefresh,
  isLoading 
}: {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  reportType: ReportType;
  setReportType: (type: ReportType) => void;
  onRefresh: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Date Range:</span>
        <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Report Type:</span>
        <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="trends">Trends</SelectItem>
            <SelectItem value="comparative">Comparative</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isLoading}
        className="ml-auto"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
      
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
}

function ComparisonCard({ 
  title, 
  current, 
  previous, 
  change, 
  icon: Icon,
  format: formatValue = (value) => value.toString()
}: {
  title: string;
  current: number;
  previous: number;
  change: number;
  icon: any;
  format?: (value: number) => string;
}) {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(current)}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Previous period: {formatValue(previous)}</span>
          <Badge 
            variant={isPositive ? "default" : isNeutral ? "secondary" : "destructive"}
            className="text-xs"
          >
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function PredictiveInsights({ data }: { data: ReportsData['predictiveAnalytics'] }) {
  const getTrendIcon = () => {
    switch (data.trendDirection) {
      case 'up': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down': return <TrendingUp className="h-5 w-5 text-red-500 rotate-180" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getTrendColor = () => {
    switch (data.trendDirection) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Predictive Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Next Month Projection</p>
              <p className="text-2xl font-bold">{data.nextMonthProjection}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {data.trendDirection.charAt(0).toUpperCase() + data.trendDirection.slice(1)} trend
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {data.confidence}% confidence
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Based on historical data analysis, we predict a {' '}
              <span className={getTrendColor().replace('text-', '')}>
                {data.trendDirection === 'up' ? 'positive' : data.trendDirection === 'down' ? 'declining' : 'stable'}
              </span> trend for the next period with {data.confidence}% confidence.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailedMetrics({ data, userRole }: { data: ReportsData['detailedMetrics']; userRole: string }) {
  if (userRole === 'job_seeker') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Career Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {data.candidateEngagement?.profileViews || 0}
              </div>
              <div className="text-sm text-blue-600">Profile Views</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {data.candidateEngagement?.messagesSent || 0}
              </div>
              <div className="text-sm text-green-600">Messages Sent</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {data.candidateEngagement?.responseRate || 0}%
              </div>
              <div className="text-sm text-purple-600">Response Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Hiring Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Average Time to Hire</span>
              <span className="text-xl font-bold">{data.averageTimeToHire || 0} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min((data.averageTimeToHire || 0) / 30 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          {data.topPerformingJobs && (
            <div>
              <h4 className="text-sm font-medium mb-3">Top Performing Jobs</h4>
              <div className="space-y-2">
                {data.topPerformingJobs.map((job, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.applications} applications</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {job.successRate}% success rate
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [reportType, setReportType] = useState<ReportType>('overview');
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportsData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const endpoint = user.role === 'job_seeker' 
        ? `/api/reports/job-seeker?range=${dateRange}&type=${reportType}` 
        : `/api/reports/employer?range=${dateRange}&type=${reportType}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch reports data');
      }
      
      const data = await response.json();
      setReportsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [user, dateRange, reportType]);

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
          <p className="text-muted-foreground">Loading reports...</p>
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
          <p className="text-red-600 font-medium">Error loading reports</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!reportsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400" />
          <p className="text-gray-600 font-medium">No data available</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or date range</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Reports</h1>
        <p className="text-muted-foreground">
          {user.role === 'job_seeker' 
            ? 'Comprehensive insights into your job search performance and market trends'
            : 'Detailed analytics and insights for your recruitment performance'
          }
        </p>
      </div>

      <ReportFilters 
        dateRange={dateRange}
        setDateRange={setDateRange}
        reportType={reportType}
        setReportType={setReportType}
        onRefresh={fetchReportsData}
        isLoading={loading}
      />

      {/* Comparison Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ComparisonCard
          title={user.role === 'job_seeker' ? 'Applications Sent' : 'Applications Received'}
          current={reportsData.comparison.current.applications}
          previous={reportsData.comparison.previous.applications}
          change={reportsData.comparison.percentageChange.applications}
          icon={FileText}
        />
        <ComparisonCard
          title={user.role === 'job_seeker' ? 'Profile Views' : 'Job Views'}
          current={reportsData.comparison.current.views}
          previous={reportsData.comparison.previous.views}
          change={reportsData.comparison.percentageChange.views}
          icon={Eye}
        />
        {user.role === 'employer' && (
          <ComparisonCard
            title="Jobs Posted"
            current={reportsData.comparison.current.jobs || 0}
            previous={reportsData.comparison.previous.jobs || 0}
            change={reportsData.comparison.percentageChange.jobs || 0}
            icon={Briefcase}
          />
        )}
        <ComparisonCard
          title="Success Rate"
          current={reportsData.comparison.current.successRate || 0}
          previous={reportsData.comparison.previous.successRate || 0}
          change={reportsData.comparison.percentageChange.successRate || 0}
          icon={CheckCircle}
          format={(value) => `${value.toFixed(1)}%`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
              Performance Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart 
              data={reportsData.timeline.map(item => ({
                ...item,
                date: format(parseISO(item.date), 'MMM dd')
              }))}
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
              <PieChartIcon className="h-5 w-5" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={reportsData.categoryBreakdown}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Advanced Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictiveInsights data={reportsData.predictiveAnalytics} />
        <DetailedMetrics data={reportsData.detailedMetrics} userRole={user.role} />
      </div>
    </div>
  );
}