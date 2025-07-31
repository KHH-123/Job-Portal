'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { ApplicationForm } from '@/components/applications/ApplicationForm';
import type { User } from '@/lib/db/schema';

interface ApplicationFormWrapperProps {
  jobId: number;
  jobTitle: string;
  companyName: string;
  hasApplied: boolean;
  user: User | null;
}

export function ApplicationFormWrapper({ 
  jobId, 
  jobTitle, 
  companyName, 
  hasApplied, 
  user 
}: ApplicationFormWrapperProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isApplied, setIsApplied] = useState(hasApplied);

  // Don't show anything if user is not a job seeker
  if (!user || user.role !== 'job_seeker') {
    return null;
  }

  // Show success message if already applied
  if (isApplied) {
    return (
      <Card className="p-6 mb-6 border-green-200 bg-green-50">
        <div className="flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Application Submitted!</h3>
            <p className="text-green-700">
              Your application for {jobTitle} at {companyName} has been sent successfully.
              You'll hear back within 5-7 business days.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Show application form if user clicked apply
  if (showApplicationForm) {
    return (
      <div className="mb-6">
        <ApplicationForm
          jobId={jobId}
          jobTitle={jobTitle}
          companyName={companyName}
          onClose={() => {
            setShowApplicationForm(false);
            // Refresh the page to update application status
            window.location.reload();
          }}
        />
      </div>
    );
  }

  // Show apply button
  return (
    <div className="mb-6">
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ready to apply?
        </h3>
        <p className="text-gray-600 mb-4">
          Submit your application for {jobTitle} at {companyName}
        </p>
        <Button 
          size="lg" 
          className="w-full max-w-md"
          onClick={() => setShowApplicationForm(true)}
        >
          Apply for this Job
        </Button>
      </Card>
    </div>
  );
}