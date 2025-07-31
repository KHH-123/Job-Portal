'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckCircle, Loader2, X } from 'lucide-react';
import { submitJobApplication } from '@/app/actions/applications';

interface ApplicationFormProps {
  jobId: number;
  jobTitle: string;
  companyName: string;
  onClose: () => void;
}

export function ApplicationForm({ jobId, jobTitle, companyName, onClose }: ApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [customResume, setCustomResume] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('jobId', jobId.toString());
      formData.append('coverLetter', coverLetter);
      if (customResume) {
        formData.append('customResume', customResume);
      }

      await submitJobApplication(formData);
      setIsSubmitted(true);
      
      // Close form after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="p-6 border-green-200 bg-green-50">
        <div className="flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Application Submitted!</h3>
            <p className="text-green-700">
              Your application for {jobTitle} at {companyName} has been sent successfully.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Apply for this Job</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900">{jobTitle}</h3>
        <p className="text-blue-700">{companyName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="coverLetter">Cover Letter *</Label>
          <Textarea
            id="coverLetter"
            placeholder="Tell us why you're interested in this role and what makes you a great fit..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={6}
            className="mt-1"
            required
            minLength={10}
            maxLength={2000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {coverLetter.length}/2000 characters (minimum 10 required)
          </p>
        </div>

        <div>
          <Label htmlFor="customResume">Custom Resume (Optional)</Label>
          <Input
            id="customResume"
            type="url"
            placeholder="https://your-resume-link.com"
            value={customResume}
            onChange={(e) => setCustomResume(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide a link to a custom resume for this application (optional)
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button 
            type="submit"
            disabled={isSubmitting || coverLetter.length < 10}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
          <Button 
            type="button"
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}