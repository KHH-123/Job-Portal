'use server';

import { eq, and, desc, count, gte, lte, sql } from 'drizzle-orm';
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
import { subDays, startOfDay, endOfDay, format } from 'date-fns';

export async function getJobSeekerAnalytics() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'job_seeker') {
    throw new Error('Only job seekers can access this data');
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sevenDaysAgo = subDays(now, 7);

    // Application statistics
    const applicationStats = await db
      .select({
        status: jobApplications.status,
        count: count(),
      })
      .from(jobApplications)
      .where(eq(jobApplications.userId, user.id))
      .groupBy(jobApplications.status);

    // Application timeline (last 30 days)
    const applicationTimeline = await db
      .select({
        date: sql<string>`DATE(${jobApplications.appliedAt})`,
        count: count(),
      })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, user.id),
          gte(jobApplications.appliedAt, thirtyDaysAgo)
        )
      )
      .groupBy(sql`DATE(${jobApplications.appliedAt})`)
      .orderBy(sql`DATE(${jobApplications.appliedAt})`);

    // Recent activity
    const recentActivity = await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        timestamp: activityLogs.timestamp,
        metadata: activityLogs.metadata,
      })
      .from(activityLogs)
      .where(eq(activityLogs.userId, user.id))
      .orderBy(desc(activityLogs.timestamp))
      .limit(10);

    // Job application success rate
    const totalApplications = await db
      .select({ count: count() })
      .from(jobApplications)
      .where(eq(jobApplications.userId, user.id));

    const acceptedApplications = await db
      .select({ count: count() })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, user.id),
          eq(jobApplications.status, 'accepted')
        )
      );

    // Application response time
    const responseTimeData = await db
      .select({
        appliedAt: jobApplications.appliedAt,
        reviewedAt: jobApplications.reviewedAt,
      })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.userId, user.id),
          sql`${jobApplications.reviewedAt} IS NOT NULL`
        )
      );

    const averageResponseTime = responseTimeData.length > 0
      ? responseTimeData.reduce((acc, curr) => {
          const days = Math.floor(
            (new Date(curr.reviewedAt!).getTime() - new Date(curr.appliedAt).getTime()) / 
            (1000 * 60 * 60 * 24)
          );
          return acc + days;
        }, 0) / responseTimeData.length
      : 0;

    return {
      applicationStats: applicationStats.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      applicationTimeline,
      recentActivity,
      totalApplications: totalApplications[0]?.count || 0,
      acceptedApplications: acceptedApplications[0]?.count || 0,
      successRate: totalApplications[0]?.count ? 
        (acceptedApplications[0]?.count || 0) / totalApplications[0].count * 100 : 0,
      averageResponseTime: Math.round(averageResponseTime),
    };
  } catch (error) {
    console.error('Error fetching job seeker analytics:', error);
    throw new Error('Failed to fetch analytics data');
  }
}

export async function getEmployerAnalytics() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'employer') {
    throw new Error('Only employers can access this data');
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sevenDaysAgo = subDays(now, 7);

    // Job posting statistics
    const jobStats = await db
      .select({
        status: jobs.status,
        count: count(),
      })
      .from(jobs)
      .where(eq(jobs.createdById, user.id))
      .groupBy(jobs.status);

    // Applications received (last 30 days)
    const applicationsReceived = await db
      .select({
        date: sql<string>`DATE(${jobApplications.appliedAt})`,
        count: count(),
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobApplications.appliedAt, thirtyDaysAgo)
        )
      )
      .groupBy(sql`DATE(${jobApplications.appliedAt})`)
      .orderBy(sql`DATE(${jobApplications.appliedAt})`);

    // Job views (last 30 days)
    const jobViewsData = await db
      .select({
        date: sql<string>`DATE(${jobViews.viewedAt})`,
        count: count(),
      })
      .from(jobViews)
      .innerJoin(jobs, eq(jobViews.jobId, jobs.id))
      .where(
        and(
          eq(jobs.createdById, user.id),
          gte(jobViews.viewedAt, thirtyDaysAgo)
        )
      )
      .groupBy(sql`DATE(${jobViews.viewedAt})`)
      .orderBy(sql`DATE(${jobViews.viewedAt})`);

    // Top performing jobs
    const topJobs = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        applicationCount: jobs.applicationCount,
        viewCount: jobs.viewCount,
        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .where(eq(jobs.createdById, user.id))
      .orderBy(desc(jobs.applicationCount))
      .limit(5);

    // Application status breakdown
    const applicationStatusBreakdown = await db
      .select({
        status: jobApplications.status,
        count: count(),
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(eq(jobs.createdById, user.id))
      .groupBy(jobApplications.status);

    // Recent activity
    const recentActivity = await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        timestamp: activityLogs.timestamp,
        metadata: activityLogs.metadata,
      })
      .from(activityLogs)
      .where(eq(activityLogs.userId, user.id))
      .orderBy(desc(activityLogs.timestamp))
      .limit(10);

    // Calculate conversion rate (views to applications)
    const totalViews = await db
      .select({ sum: sql<number>`COALESCE(SUM(${jobs.viewCount}), 0)` })
      .from(jobs)
      .where(eq(jobs.createdById, user.id));

    const totalApplicationsReceived = await db
      .select({ sum: sql<number>`COALESCE(SUM(${jobs.applicationCount}), 0)` })
      .from(jobs)
      .where(eq(jobs.createdById, user.id));

    const conversionRate = totalViews[0]?.sum ? 
      (totalApplicationsReceived[0]?.sum || 0) / totalViews[0].sum * 100 : 0;

    return {
      jobStats: jobStats.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      applicationsReceived,
      jobViewsData,
      topJobs,
      applicationStatusBreakdown: applicationStatusBreakdown.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      recentActivity,
      totalViews: totalViews[0]?.sum || 0,
      totalApplicationsReceived: totalApplicationsReceived[0]?.sum || 0,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  } catch (error) {
    console.error('Error fetching employer analytics:', error);
    throw new Error('Failed to fetch analytics data');
  }
}

export async function getPlatformAnalytics() {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Only admin users can access platform analytics');
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);

    // User growth
    const userGrowth = await db
      .select({
        date: sql<string>`DATE(${users.createdAt})`,
        jobSeekers: sql<number>`SUM(CASE WHEN ${users.role} = 'job_seeker' THEN 1 ELSE 0 END)`,
        employers: sql<number>`SUM(CASE WHEN ${users.role} = 'employer' THEN 1 ELSE 0 END)`,
      })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${users.createdAt})`)
      .orderBy(sql`DATE(${users.createdAt})`);

    // Job posting trends
    const jobPostingTrends = await db
      .select({
        date: sql<string>`DATE(${jobs.createdAt})`,
        count: count(),
      })
      .from(jobs)
      .where(gte(jobs.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${jobs.createdAt})`)
      .orderBy(sql`DATE(${jobs.createdAt})`);

    // Overall platform stats
    const totalUsers = await db.select({ count: count() }).from(users);
    const totalJobs = await db.select({ count: count() }).from(jobs);
    const totalApplications = await db.select({ count: count() }).from(jobApplications);
    const totalCompanies = await db.select({ count: count() }).from(companies);

    return {
      userGrowth,
      jobPostingTrends,
      totalUsers: totalUsers[0]?.count || 0,
      totalJobs: totalJobs[0]?.count || 0,
      totalApplications: totalApplications[0]?.count || 0,
      totalCompanies: totalCompanies[0]?.count || 0,
    };
  } catch (error) {
    console.error('Error fetching platform analytics:', error);
    throw new Error('Failed to fetch platform analytics data');
  }
}