'use server';

import { eq, and, desc, count, gte, lte, sql, avg } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  jobs,
  jobApplications,
  jobViews,
  users,
  companies,
  activityLogs,
} from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { subDays, subMonths, startOfDay, endOfDay, format, differenceInDays } from 'date-fns';

type DateRange = '7d' | '30d' | '90d' | '6m' | '1y';
type ReportType = 'overview' | 'performance' | 'trends' | 'comparative';

function getDateRangeFilter(range: DateRange) {
  const now = new Date();
  switch (range) {
    case '7d': return subDays(now, 7);
    case '30d': return subDays(now, 30);
    case '90d': return subDays(now, 90);
    case '6m': return subMonths(now, 6);
    case '1y': return subMonths(now, 12);
    default: return subDays(now, 30);
  }
}

function getPreviousDateRange(range: DateRange) {
  const now = new Date();
  switch (range) {
    case '7d': return { start: subDays(now, 14), end: subDays(now, 7) };
    case '30d': return { start: subDays(now, 60), end: subDays(now, 30) };
    case '90d': return { start: subDays(now, 180), end: subDays(now, 90) };
    case '6m': return { start: subMonths(now, 12), end: subMonths(now, 6) };
    case '1y': return { start: subMonths(now, 24), end: subMonths(now, 12) };
    default: return { start: subDays(now, 60), end: subDays(now, 30) };
  }
}

export async function getAdvancedJobSeekerReports(range: DateRange = '30d', type: ReportType = 'overview') {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'job_seeker') {
    throw new Error('Only job seekers can access this data');
  }

  try {
    const now = new Date();
    const startDate = getDateRangeFilter(range);
    const previousRange = getPreviousDateRange(range);

    // Timeline data for charts
    const timeline = await db
      .select({
        date: sql<string>`DATE(${jobApplications.appliedAt})`,
        applications: count(),
        views: sql<number>`0`, // Job seekers don't have view data in the same way
      })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, user.id),
          gte(jobApplications.appliedAt, startDate)
        )
      )
      .groupBy(sql`DATE(${jobApplications.appliedAt})`)
      .orderBy(sql`DATE(${jobApplications.appliedAt})`);

    // Current period metrics
    const currentApplications = await db
      .select({ count: count() })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, user.id),
          gte(jobApplications.appliedAt, startDate)
        )
      );

    const currentAccepted = await db
      .select({ count: count() })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, user.id),
          eq(jobApplications.status, 'accepted'),
          gte(jobApplications.appliedAt, startDate)
        )
      );

    // Previous period metrics
    const previousApplications = await db
      .select({ count: count() })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, user.id),
          gte(jobApplications.appliedAt, previousRange.start),
          lte(jobApplications.appliedAt, previousRange.end)
        )
      );

    const previousAccepted = await db
      .select({ count: count() })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, user.id),
          eq(jobApplications.status, 'accepted'),
          gte(jobApplications.appliedAt, previousRange.start),
          lte(jobApplications.appliedAt, previousRange.end)
        )
      );

    // Category breakdown (by application status)
    const categoryBreakdown = await db
      .select({
        status: jobApplications.status,
        count: count(),
      })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, user.id),
          gte(jobApplications.appliedAt, startDate)
        )
      )
      .groupBy(jobApplications.status);

    // Calculate metrics
    const currentTotal = currentApplications[0]?.count || 0;
    const currentSuccessful = currentAccepted[0]?.count || 0;
    const currentSuccessRate = currentTotal > 0 ? (currentSuccessful / currentTotal) * 100 : 0;

    const previousTotal = previousApplications[0]?.count || 0;
    const previousSuccessful = previousAccepted[0]?.count || 0;
    const previousSuccessRate = previousTotal > 0 ? (previousSuccessful / previousTotal) * 100 : 0;

    // Calculate percentage changes
    const applicationsChange = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
    const successRateChange = previousSuccessRate > 0 ? ((currentSuccessRate - previousSuccessRate) / previousSuccessRate) * 100 : 0;

    // Predictive analytics (basic trend analysis)
    const recentApplications = timeline.slice(-7); // Last 7 data points
    const averageApplications = recentApplications.reduce((acc, curr) => acc + curr.applications, 0) / (recentApplications.length || 1);
    
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    if (recentApplications.length >= 2) {
      const firstHalf = recentApplications.slice(0, Math.ceil(recentApplications.length / 2));
      const secondHalf = recentApplications.slice(Math.ceil(recentApplications.length / 2));
      const firstAvg = firstHalf.reduce((acc, curr) => acc + curr.applications, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((acc, curr) => acc + curr.applications, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg * 1.1) trendDirection = 'up';
      else if (secondAvg < firstAvg * 0.9) trendDirection = 'down';
    }

    return {
      timeline: timeline.map(item => ({
        date: item.date,
        applications: item.applications,
        views: 0 // Job seekers don't track views the same way
      })),
      comparison: {
        current: {
          applications: currentTotal,
          views: 0,
          successRate: currentSuccessRate
        },
        previous: {
          applications: previousTotal,
          views: 0,
          successRate: previousSuccessRate
        },
        percentageChange: {
          applications: applicationsChange,
          views: 0,
          successRate: successRateChange
        }
      },
      categoryBreakdown: categoryBreakdown.map(item => ({
        name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        value: item.count,
        color: getStatusColor(item.status)
      })),
      predictiveAnalytics: {
        nextMonthProjection: Math.round(averageApplications * 30),
        trendDirection,
        confidence: 75 // Basic confidence score
      },
      detailedMetrics: {
        candidateEngagement: {
          profileViews: Math.floor(Math.random() * 100) + 50, // Mock data
          messagesSent: Math.floor(Math.random() * 20) + 5,
          responseRate: Math.floor(Math.random() * 40) + 30
        }
      }
    };
  } catch (error) {
    console.error('Error fetching job seeker reports:', error);
    throw new Error('Failed to fetch reports data');
  }
}

export async function getAdvancedEmployerReports(range: DateRange = '30d', type: ReportType = 'overview') {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'employer') {
    throw new Error('Only employers can access this data');
  }

  try {
    const now = new Date();
    const startDate = getDateRangeFilter(range);
    const previousRange = getPreviousDateRange(range);

    // Timeline data for applications received
    const applicationsTimeline = await db
      .select({
        date: sql<string>`DATE(${jobApplications.appliedAt})`,
        applications: count(),
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobApplications.appliedAt, startDate)
        )
      )
      .groupBy(sql`DATE(${jobApplications.appliedAt})`)
      .orderBy(sql`DATE(${jobApplications.appliedAt})`);

    // Timeline data for job views
    const viewsTimeline = await db
      .select({
        date: sql<string>`DATE(${jobViews.viewedAt})`,
        views: count(),
      })
      .from(jobViews)
      .innerJoin(jobs, eq(jobViews.jobId, jobs.id))
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobViews.viewedAt, startDate)
        )
      )
      .groupBy(sql`DATE(${jobViews.viewedAt})`)
      .orderBy(sql`DATE(${jobViews.viewedAt})`);

    // Combine timeline data
    const timeline = combineDateRangeData(applicationsTimeline, viewsTimeline);

    // Current period metrics
    const currentApplications = await db
      .select({ count: count() })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobApplications.appliedAt, startDate)
        )
      );

    const currentViews = await db
      .select({ sum: sql<number>`COALESCE(SUM(${jobs.viewCount}), 0)` })
      .from(jobs)
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobs.createdAt, startDate)
        )
      );

    const currentJobs = await db
      .select({ count: count() })
      .from(jobs)
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobs.createdAt, startDate)
        )
      );

    const currentAccepted = await db
      .select({ count: count() })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(
        and(
          eq(jobs.createdById, user.id),
          eq(jobApplications.status, 'accepted'),
          gte(jobApplications.appliedAt, startDate)
        )
      );

    // Previous period metrics
    const previousApplications = await db
      .select({ count: count() })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobApplications.appliedAt, previousRange.start),
          lte(jobApplications.appliedAt, previousRange.end)
        )
      );

    const previousViews = await db
      .select({ sum: sql<number>`COALESCE(SUM(${jobs.viewCount}), 0)` })
      .from(jobs)
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobs.createdAt, previousRange.start),
          lte(jobs.createdAt, previousRange.end)
        )
      );

    const previousJobs = await db
      .select({ count: count() })
      .from(jobs)
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobs.createdAt, previousRange.start),
          lte(jobs.createdAt, previousRange.end)
        )
      );

    const previousAccepted = await db
      .select({ count: count() })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(
        and(
          eq(jobs.createdById, user.id),
          eq(jobApplications.status, 'accepted'),
          gte(jobApplications.appliedAt, previousRange.start),
          lte(jobApplications.appliedAt, previousRange.end)
        )
      );

    // Category breakdown (by application status)
    const categoryBreakdown = await db
      .select({
        status: jobApplications.status,
        count: count(),
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobApplications.appliedAt, startDate)
        )
      )
      .groupBy(jobApplications.status);

    // Top performing jobs
    const topJobs = await db
      .select({
        title: jobs.title,
        applications: jobs.applicationCount,
        views: jobs.viewCount,
        successRate: sql<number>`
          CASE 
            WHEN ${jobs.applicationCount} > 0 
            THEN ROUND((
              SELECT COUNT(*) 
              FROM ${jobApplications} 
              WHERE ${jobApplications.jobId} = ${jobs.id} 
              AND ${jobApplications.status} = 'accepted'
            )::decimal / ${jobs.applicationCount} * 100, 1)
            ELSE 0 
          END
        `
      })
      .from(jobs)
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobs.createdAt, startDate)
        )
      )
      .orderBy(desc(jobs.applicationCount))
      .limit(5);

    // Average time to hire
    const hireTimeData = await db
      .select({
        appliedAt: jobApplications.appliedAt,
        reviewedAt: jobApplications.reviewedAt,
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(
        and(
          eq(jobs.createdById, user.id),
          eq(jobApplications.status, 'accepted'),
          sql`${jobApplications.reviewedAt} IS NOT NULL`,
          gte(jobApplications.appliedAt, startDate)
        )
      );

    const averageTimeToHire = hireTimeData.length > 0
      ? hireTimeData.reduce((acc, curr) => {
          const days = differenceInDays(new Date(curr.reviewedAt!), new Date(curr.appliedAt));
          return acc + days;
        }, 0) / hireTimeData.length
      : 0;

    // Calculate metrics
    const currentAppTotal = currentApplications[0]?.count || 0;
    const currentViewsTotal = currentViews[0]?.sum || 0;
    const currentJobsTotal = currentJobs[0]?.count || 0;
    const currentAcceptedTotal = currentAccepted[0]?.count || 0;
    const currentSuccessRate = currentAppTotal > 0 ? (currentAcceptedTotal / currentAppTotal) * 100 : 0;

    const previousAppTotal = previousApplications[0]?.count || 0;
    const previousViewsTotal = previousViews[0]?.sum || 0;
    const previousJobsTotal = previousJobs[0]?.count || 0;
    const previousAcceptedTotal = previousAccepted[0]?.count || 0;
    const previousSuccessRate = previousAppTotal > 0 ? (previousAcceptedTotal / previousAppTotal) * 100 : 0;

    // Calculate percentage changes
    const applicationsChange = previousAppTotal > 0 ? ((currentAppTotal - previousAppTotal) / previousAppTotal) * 100 : 0;
    const viewsChange = previousViewsTotal > 0 ? ((currentViewsTotal - previousViewsTotal) / previousViewsTotal) * 100 : 0;
    const jobsChange = previousJobsTotal > 0 ? ((currentJobsTotal - previousJobsTotal) / previousJobsTotal) * 100 : 0;
    const successRateChange = previousSuccessRate > 0 ? ((currentSuccessRate - previousSuccessRate) / previousSuccessRate) * 100 : 0;

    // Predictive analytics
    const recentApplications = applicationsTimeline.slice(-7);
    const averageApplications = recentApplications.reduce((acc, curr) => acc + curr.applications, 0) / (recentApplications.length || 1);
    
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    if (recentApplications.length >= 2) {
      const firstHalf = recentApplications.slice(0, Math.ceil(recentApplications.length / 2));
      const secondHalf = recentApplications.slice(Math.ceil(recentApplications.length / 2));
      const firstAvg = firstHalf.reduce((acc, curr) => acc + curr.applications, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((acc, curr) => acc + curr.applications, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg * 1.1) trendDirection = 'up';
      else if (secondAvg < firstAvg * 0.9) trendDirection = 'down';
    }

    return {
      timeline,
      comparison: {
        current: {
          applications: currentAppTotal,
          views: currentViewsTotal,
          jobs: currentJobsTotal,
          successRate: currentSuccessRate
        },
        previous: {
          applications: previousAppTotal,
          views: previousViewsTotal,
          jobs: previousJobsTotal,
          successRate: previousSuccessRate
        },
        percentageChange: {
          applications: applicationsChange,
          views: viewsChange,
          jobs: jobsChange,
          successRate: successRateChange
        }
      },
      categoryBreakdown: categoryBreakdown.map(item => ({
        name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        value: item.count,
        color: getStatusColor(item.status)
      })),
      predictiveAnalytics: {
        nextMonthProjection: Math.round(averageApplications * 30),
        trendDirection,
        confidence: 80
      },
      detailedMetrics: {
        averageTimeToHire: Math.round(averageTimeToHire),
        topPerformingJobs: topJobs.map(job => ({
          title: job.title,
          applications: job.applications || 0,
          successRate: job.successRate || 0
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching employer reports:', error);
    throw new Error('Failed to fetch reports data');
  }
}

function combineDateRangeData(
  applicationsData: Array<{ date: string; applications: number }>,
  viewsData: Array<{ date: string; views: number }>
) {
  const dateMap = new Map<string, { date: string; applications: number; views: number }>();
  
  // Add applications data
  applicationsData.forEach(item => {
    dateMap.set(item.date, {
      date: item.date,
      applications: item.applications,
      views: 0
    });
  });
  
  // Add views data
  viewsData.forEach(item => {
    const existing = dateMap.get(item.date);
    if (existing) {
      existing.views = item.views;
    } else {
      dateMap.set(item.date, {
        date: item.date,
        applications: 0,
        views: item.views
      });
    }
  });
  
  return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: '#f59e0b',
    reviewed: '#3b82f6', 
    interview: '#8b5cf6',
    accepted: '#10b981',
    rejected: '#ef4444',
    withdrawn: '#6b7280'
  };
  return colors[status] || '#6b7280';
}