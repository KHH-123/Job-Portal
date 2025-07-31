'use client';

import { applyToJob } from '@/app/actions/applications';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ApplicationFormWrapperProps {
  companyName?: string;
  hasApplied?: boolean;
  user?: any;
  
  jobId: number;
  jobTitle: string;
}

export function ApplicationFormWrapper({ jobId, jobTitle, companyName, hasApplied, user }: ApplicationFormWrapperProps) {
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleApply = async () => {
    setIsLoading(true);
    try {
      await applyToJob(jobId, coverLetter);
      alert('Application submitted successfully!');
      router.refresh();
    } catch (error: any) {
      console.error('Error applying to job:', error);
      alert(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} className="w-full">
        Apply Now
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
          Cover Letter (Optional)
        </label>
        <Textarea
          id="coverLetter"
          placeholder={`Write a cover letter for ${jobTitle}...`}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={4}
        />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleApply} disabled={isLoading} className="flex-1">
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </Button>
        <Button variant="outline" onClick={() => setShowForm(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
