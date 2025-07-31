'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { withdrawApplication } from '@/app/actions/applications';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface WithdrawApplicationButtonProps {
  applicationId: number;
  jobTitle: string;
}

export function WithdrawApplicationButton({ applicationId, jobTitle }: WithdrawApplicationButtonProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      await withdrawApplication(applicationId);
      setIsOpen(false);
    } catch (error) {
      console.error('Error withdrawing application:', error);
      // You could add a toast notification here
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4 mr-1" />
          Withdraw
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to withdraw your application for <strong>{jobTitle}</strong>? 
            This action cannot be undone and you will need to reapply if you change your mind.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isWithdrawing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleWithdraw}
            disabled={isWithdrawing}
            className="bg-red-600 hover:bg-red-700"
          >
            {isWithdrawing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Withdrawing...
              </>
            ) : (
              'Withdraw Application'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}