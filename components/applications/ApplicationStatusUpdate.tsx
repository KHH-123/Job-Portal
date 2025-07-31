'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, Clock, Eye, MessageCircle, XCircle, Loader2 } from 'lucide-react';
import { updateApplicationStatus } from '@/app/actions/applications';

interface ApplicationStatusUpdateProps {
  applicationId: number;
  currentStatus: string;
  currentNotes: string;
}

export function ApplicationStatusUpdate({ 
  applicationId, 
  currentStatus, 
  currentNotes 
}: ApplicationStatusUpdateProps) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending Review', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'reviewed', label: 'Reviewed', icon: Eye, color: 'bg-blue-100 text-blue-800' },
    { value: 'interview', label: 'Interview Stage', icon: MessageCircle, color: 'bg-purple-100 text-purple-800' },
    { value: 'accepted', label: 'Accepted', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'bg-red-100 text-red-800' },
  ];

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setHasChanges(newStatus !== currentStatus || notes !== currentNotes);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    setHasChanges(status !== currentStatus || newNotes !== currentNotes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append('applicationId', applicationId.toString());
      formData.append('status', status);
      formData.append('notes', notes);

      await updateApplicationStatus(formData);
      setHasChanges(false);
      
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error updating application status:', error);
      // You could add a toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusOption = statusOptions.find(opt => opt.value === status);
  const StatusIcon = currentStatusOption?.icon || Clock;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="status">Application Status</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes">Internal Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add internal notes about this candidate or application..."
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={4}
            className="mt-1"
          />
        </div>

        {hasChanges && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-700">
              You have unsaved changes. Click "Update Status" to save them.
            </p>
          </div>
        )}

        <Button 
          type="submit"
          className="w-full"
          disabled={!hasChanges || isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Status'
          )}
        </Button>
      </form>

      {/* Current Status Display */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <Badge className={`flex items-center gap-1 ${currentStatusOption?.color}`}>
            <StatusIcon className="h-3 w-3" />
            <span className="capitalize">{currentStatus}</span>
          </Badge>
          <span className="text-sm text-gray-500">Current Status</span>
        </div>
      </div>
    </Card>
  );
}