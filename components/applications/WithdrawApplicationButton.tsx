'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { withdrawApplication } from '@/app/actions/applications';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface WithdrawApplicationButtonProps {
  applicationId: number;
  jobTitle: string;
}

export function WithdrawApplicationButton({ applicationId, jobTitle }: WithdrawApplicationButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!confirm(`Are you sure you want to withdraw your application for "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      await withdrawApplication(applicationId);
      router.refresh();
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Failed to withdraw application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleWithdraw}
      disabled={isLoading}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {isLoading ? 'Withdrawing...' : 'Withdraw'}
    </Button>
  );
}
