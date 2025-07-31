import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Settings,
  LogOut,
  UserPlus,
  Lock,
  UserCog,
  AlertCircle,
  UserMinus,
  Eye,
  FileText,
  Trash2,
  BookmarkCheck,
  Bookmark,
  Send,
  CheckCircle,
  XCircle,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import { ActivityType } from '@/lib/db/schema';
import { getActivityLogs } from '@/lib/db/queries';

const iconMap: Record<ActivityType, LucideIcon> = {
  [ActivityType.SIGN_UP]: UserPlus,
  [ActivityType.SIGN_IN]: UserCog,
  [ActivityType.SIGN_OUT]: LogOut,
  [ActivityType.UPDATE_PASSWORD]: Lock,
  [ActivityType.DELETE_ACCOUNT]: UserMinus,
  [ActivityType.UPDATE_ACCOUNT]: Settings,
  [ActivityType.UPDATE_PROFILE]: Settings,
  [ActivityType.JOB_CREATED]: FileText,
  [ActivityType.JOB_UPDATED]: FileText,
  [ActivityType.JOB_DELETED]: Trash2,
  [ActivityType.JOB_VIEWED]: Eye,
  [ActivityType.JOB_SAVED]: BookmarkCheck,
  [ActivityType.JOB_UNSAVED]: Bookmark,
  [ActivityType.APPLICATION_SUBMITTED]: Send,
  [ActivityType.APPLICATION_REVIEWED]: CheckCircle,
  [ActivityType.APPLICATION_ACCEPTED]: CheckCircle,
  [ActivityType.APPLICATION_REJECTED]: XCircle,
  [ActivityType.COMPANY_CREATED]: Building2,
  [ActivityType.COMPANY_UPDATED]: Building2,
};

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

function formatAction(action: ActivityType): string {
  switch (action) {
    case ActivityType.SIGN_UP:
      return 'You signed up';
    case ActivityType.SIGN_IN:
      return 'You signed in';
    case ActivityType.SIGN_OUT:
      return 'You signed out';
    case ActivityType.UPDATE_PASSWORD:
      return 'You changed your password';
    case ActivityType.DELETE_ACCOUNT:
      return 'You deleted your account';
    case ActivityType.UPDATE_ACCOUNT:
      return 'You updated your account';
    case ActivityType.UPDATE_PROFILE:
      return 'You updated your profile';
    case ActivityType.JOB_CREATED:
      return 'You created a new job';
    case ActivityType.JOB_UPDATED:
      return 'You updated a job';
    case ActivityType.JOB_DELETED:
      return 'You deleted a job';
    case ActivityType.JOB_VIEWED:
      return 'You viewed a job';
    case ActivityType.JOB_SAVED:
      return 'You saved a job';
    case ActivityType.JOB_UNSAVED:
      return 'You unsaved a job';
    case ActivityType.APPLICATION_SUBMITTED:
      return 'You submitted a job application';
    case ActivityType.APPLICATION_REVIEWED:
      return 'Your application was reviewed';
    case ActivityType.APPLICATION_ACCEPTED:
      return 'Your application was accepted';
    case ActivityType.APPLICATION_REJECTED:
      return 'Your application was rejected';
    case ActivityType.COMPANY_CREATED:
      return 'You created your company profile';
    case ActivityType.COMPANY_UPDATED:
      return 'You updated your company profile';
    default:
      return 'Unknown action occurred';
  }
}

export default async function ActivityPage() {
  const logs = await getActivityLogs();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Activity Log
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <ul className="space-y-4">
              {logs.map((log) => {
                const Icon = iconMap[log.action as ActivityType] || Settings;
                const formattedAction = formatAction(
                  log.action as ActivityType
                );

                return (
                  <li key={log.id} className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {formattedAction}
                        {log.ipAddress && ` from IP ${log.ipAddress}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRelativeTime(new Date(log.timestamp))}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <AlertCircle className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No activity yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                When you perform actions like applying for jobs, signing in, or updating your
                profile, they'll appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
