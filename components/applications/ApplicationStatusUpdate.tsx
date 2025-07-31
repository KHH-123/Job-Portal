'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateApplicationStatus } from '@/app/actions/applications';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ApplicationStatusUpdateProps {
  applicationId: number;
  currentStatus: string;
}

export function ApplicationStatusUpdate({ applicationId, currentStatus }: ApplicationStatusUpdateProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      await updateApplicationStatus(applicationId, newStatus as any);
      router.refresh();
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isLoading}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="reviewing">Reviewing</SelectItem>
        <SelectItem value="interviewed">Interviewed</SelectItem>
        <SelectItem value="accepted">Accepted</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
}
