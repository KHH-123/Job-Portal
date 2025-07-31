'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, X, Plus, Save, Eye } from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    type: '',
    experienceLevel: '',
    workMode: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    applicationDeadline: '',
    skills: [] as string[],
    status: 'draft'
  });
  
  const [currentSkill, setCurrentSkill] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (status: 'draft' | 'active') => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would make the actual API call to save the job
    console.log('Submitting job:', { ...formData, status });
    
    setIsSubmitting(false);
    router.push('/dashboard/employer/jobs');
  };

  const isFormValid = () => {
    return formData.title.trim() && 
           formData.description.trim() && 
           formData.type && 
           formData.experienceLevel && 
           formData.workMode;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
            <p className="text-gray-600 mt-1">Create a new job posting to attract top talent</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Job Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full-time</SelectItem>
                      <SelectItem value="part_time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experienceLevel">Experience Level *</Label>
                  <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workMode">Work Mode *</Label>
                  <Select value={formData.workMode} onValueChange={(value) => handleInputChange('workMode', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select work mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Salary Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Salary Information</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                  placeholder="80000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="salaryMax">Maximum Salary</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                  placeholder="120000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Job Description */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description *</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the job role, company culture, and what makes this opportunity exciting..."
                  rows={6}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="List the required skills, experience, and qualifications..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                  placeholder="Describe the key responsibilities and day-to-day tasks..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="benefits">Benefits & Perks</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => handleInputChange('benefits', e.target.value)}
                  placeholder="List the benefits, perks, and what makes your company a great place to work..."
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button onClick={addSkill} disabled={!currentSkill.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Application Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Settings</h2>
            
            <div>
              <Label htmlFor="applicationDeadline">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty for no deadline
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => handleSubmit('active')}
                  disabled={isSubmitting || !isFormValid()}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Job'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSubmit('draft')}
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={!isFormValid()}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </Card>

            {/* Publishing Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Tips</h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Write a clear and specific job title to attract the right candidates</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Include salary range to increase application rates by up to 30%</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Add relevant skills to help candidates find your job easier</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Highlight company benefits and culture to stand out</p>
                </div>
              </div>
            </Card>

            {/* Job Preview */}
            {formData.title && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Preview</h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{formData.title}</h4>
                    <p className="text-sm text-gray-600">Your Company Name</p>
                  </div>
                  
                  {formData.location && (
                    <p className="text-sm text-gray-600">{formData.location}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {formData.type && (
                      <Badge variant="secondary" className="text-xs capitalize">
                        {formData.type.replace('_', '-')}
                      </Badge>
                    )}
                    {formData.workMode && (
                      <Badge variant="secondary" className="text-xs">
                        {formData.workMode}
                      </Badge>
                    )}
                  </div>
                  
                  {(formData.salaryMin || formData.salaryMax) && (
                    <p className="text-sm font-medium text-green-600">
                      {formData.salaryMin && `$${(Number(formData.salaryMin) / 1000).toFixed(0)}k`}
                      {formData.salaryMin && formData.salaryMax && ' - '}
                      {formData.salaryMax && `$${(Number(formData.salaryMax) / 1000).toFixed(0)}k`}
                    </p>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}