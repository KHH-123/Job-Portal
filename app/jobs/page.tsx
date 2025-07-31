'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Filter, Briefcase, Clock, DollarSign, Building } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

// Mock job data - replace with real data from API
const mockJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    workMode: 'Remote',
    salaryMin: 120000,
    salaryMax: 160000,
    currency: 'USD',
    description: 'We are looking for a Senior Frontend Developer to join our dynamic team...',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    postedAt: '2 days ago',
    logo: 'https://placehold.co/64x64/3b82f6/ffffff?text=TC'
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'Full-time',
    workMode: 'Hybrid',
    salaryMin: 100000,
    salaryMax: 140000,
    currency: 'USD',
    description: 'Join our product team and help shape the future of our platform...',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
    postedAt: '1 week ago',
    logo: 'https://placehold.co/64x64/10b981/ffffff?text=SX'
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    type: 'Contract',
    workMode: 'Remote',
    salaryMin: 80000,
    salaryMax: 110000,
    currency: 'USD',
    description: 'We need a talented UX Designer to create amazing user experiences...',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    postedAt: '3 days ago',
    logo: 'https://placehold.co/64x64/f59e0b/ffffff?text=DS'
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'AI Solutions',
    location: 'Austin, TX',
    type: 'Full-time',
    workMode: 'Onsite',
    salaryMin: 110000,
    salaryMax: 150000,
    currency: 'USD',
    description: 'Looking for an experienced Data Scientist to work on cutting-edge ML projects...',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    postedAt: '5 days ago',
    logo: 'https://placehold.co/64x64/8b5cf6/ffffff?text=AI'
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Seattle, WA',
    type: 'Full-time',
    workMode: 'Remote',
    salaryMin: 130000,
    salaryMax: 170000,
    currency: 'USD',
    description: 'Join our infrastructure team and help scale our cloud platform...',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    postedAt: '1 day ago',
    logo: 'https://placehold.co/64x64/ef4444/ffffff?text=CT'
  },
  {
    id: 6,
    title: 'Marketing Manager',
    company: 'GrowthCo',
    location: 'Chicago, IL',
    type: 'Full-time',
    workMode: 'Hybrid',
    salaryMin: 75000,
    salaryMax: 95000,
    currency: 'USD',
    description: 'Drive our marketing initiatives and help us reach new audiences...',
    skills: ['Digital Marketing', 'SEO', 'Analytics', 'Content Strategy'],
    postedAt: '4 days ago',
    logo: 'https://placehold.co/64x64/06b6d4/ffffff?text=GC'
  }
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter jobs based on search criteria
  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = location === '' || 
      job.location.toLowerCase().includes(location.toLowerCase());
    
    const matchesJobType = jobType === '' || job.type === jobType;
    const matchesWorkMode = workMode === '' || job.workMode === workMode;
    
    return matchesSearch && matchesLocation && matchesJobType && matchesWorkMode;
  });

  const formatSalary = (min: number, max: number, currency: string) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Next Job</h1>
          <p className="text-gray-600 mt-2">Discover {mockJobs.length} job opportunities from top companies</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>

              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title or Keywords
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="e.g. Frontend Developer"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="e.g. San Francisco, CA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <Select value={jobType || "all"} onValueChange={(value) => setJobType(value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Work Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Mode
                  </label>
                  <Select value={workMode || "all"} onValueChange={(value) => setWorkMode(value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All modes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All modes</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Onsite">Onsite</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm('');
                    setLocation('');
                    setJobType('');
                    setWorkMode('');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content - Job Listings */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredJobs.length} of {mockJobs.length} jobs
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                  <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Company Logo */}
                      <img
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      
                      {/* Job Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link href={`/jobs/${job.id}`}>
                              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                {job.title}
                              </h3>
                            </Link>
                            <div className="flex items-center text-gray-600 mt-1">
                              <Building className="h-4 w-4 mr-1" />
                              <span className="font-medium">{job.company}</span>
                            </div>
                          </div>
                          
                          {/* Save Job Button */}
                          <Button variant="outline" size="sm">
                            Save
                          </Button>
                        </div>

                        {/* Job Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.workMode}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                          </div>
                        </div>

                        {/* Job Description */}
                        <p className="text-gray-600 mt-3 line-clamp-2">
                          {job.description}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {job.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.skills.length - 4} more
                            </Badge>
                          )}
                        </div>

                        {/* Posted Date */}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-gray-500">Posted {job.postedAt}</span>
                          <Link href={`/jobs/${job.id}`}>
                            <Button>
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setLocation('');
                    setJobType('');
                    setWorkMode('');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination Placeholder */}
            {filteredJobs.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button className="bg-blue-600 text-white">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}