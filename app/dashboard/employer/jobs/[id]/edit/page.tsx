import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function EditJobPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  if (user.role !== 'employer') {
    redirect('/dashboard');
  }

  // Mock job data - replace with real database query
  const job = {
    id: id,
    title: 'Senior Frontend Developer',
    description: 'We are looking for a senior frontend developer to join our team...',
    requirements: 'Bachelor\'s degree in Computer Science or related field...',
    type: 'full_time',
    workMode: 'remote',
    experienceLevel: 'senior',
    location: 'Remote',
    salaryMin: '120000',
    salaryMax: '160000',
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
    status: 'active'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/employer/jobs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
            <p className="text-gray-600 mt-1">Update your job posting details</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link href={`/jobs/${job.id}`}>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <form className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={job.title}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                defaultValue={job.location}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                id="type"
                name="type"
                defaultValue={job.type}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select job type</option>
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label htmlFor="workMode" className="block text-sm font-medium text-gray-700 mb-2">
                Work Mode *
              </label>
              <select
                id="workMode"
                name="workMode"
                defaultValue={job.workMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select work mode</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                defaultValue={job.experienceLevel}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select experience level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                defaultValue={job.status}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Salary Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Salary Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary ($)
              </label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                defaultValue={job.salaryMin}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="1000"
              />
            </div>
            
            <div>
              <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary ($)
              </label>
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                defaultValue={job.salaryMax}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="1000"
              />
            </div>
          </div>
        </Card>

        {/* Job Description */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                defaultValue={job.description}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the job role, responsibilities, and what makes this position exciting..."
                required
              />
            </div>
            
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Requirements *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={6}
                defaultValue={job.requirements}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="List the required qualifications, skills, and experience..."
                required
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                defaultValue={job.skills.join(', ')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="React, TypeScript, Node.js, AWS..."
              />
              <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Link href="/dashboard/employer/jobs">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}