'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
''
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
import { Upload, Save, Eye, User, Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Plus, X, Calendar, Award, FileText, Download } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    // Basic Information
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Frontend Developer',
    summary: 'Passionate frontend developer with 5+ years of experience building scalable web applications using React, TypeScript, and modern web technologies. I love creating intuitive user experiences and collaborating with cross-functional teams.',
    avatar: 'https://placehold.co/120x120/6366f1/ffffff?text=SJ',
    
    // Professional Details
    experience: [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        startDate: '2022-01',
        endDate: 'present',
        current: true,
        description: 'Lead frontend development for core product features, mentoring junior developers, and implementing best practices for code quality and performance.'
      },
      {
        id: 2,
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        startDate: '2020-03',
        endDate: '2021-12',
        current: false,
        description: 'Developed responsive web applications using React and Redux, collaborated with design team to implement pixel-perfect UIs.'
      }
    ],
    
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        startDate: '2016-09',
        endDate: '2020-05',
        description: 'Graduated Magna Cum Laude with a focus on software engineering and web development.'
      }
    ],
    
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Python', 'PostgreSQL', 'Git', 'Jest', 'Cypress'],
    
    // Links and Files
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    githubUrl: 'https://github.com/sarahjohnson',
    portfolioUrl: 'https://sarahjohnson.dev',
    resume: '/resumes/sarah-johnson.pdf',
    
    // Job Preferences
    expectedSalary: '140000',
    preferredRoles: ['Frontend Developer', 'Full Stack Developer', 'Software Engineer'],
    workModes: ['Remote', 'Hybrid'],
    availability: 'immediately',
    isOpenToWork: true,
    
    // Achievements
    achievements: [
      'Led migration of legacy React application to Next.js, improving performance by 40%',
      'Mentored 3 junior developers and established code review processes',
      'Built component library used across 5 different products',
      'Speaker at ReactConf 2023'
    ]
  });

  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim() && !profileData.achievements.includes(newAchievement.trim())) {
      setProfileData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (achievementToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement !== achievementToRemove)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'present') return 'Present';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your professional profile to attract employers
          </p>
        </div>
        <div className="flex space-x-3">
          {!isEditing ? (
            <>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="flex items-start space-x-6">
              {/* Profile Photo */}
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <Button variant="secondary" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          value={profileData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        value={profileData.summary}
                        onChange={(e) => handleInputChange('summary', e.target.value)}
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                    <p className="text-xl text-gray-600 mt-1">{profileData.title}</p>
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {profileData.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {profileData.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {profileData.location}
                      </div>
                    </div>

                    <p className="text-gray-600 mt-4 leading-relaxed">{profileData.summary}</p>

                    {/* Social Links */}
                    <div className="flex items-center space-x-4 mt-4">
                      <a href={profileData.linkedinUrl} className="text-blue-600 hover:text-blue-800">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href={profileData.githubUrl} className="text-gray-700 hover:text-gray-900">
                        <Github className="h-5 w-5" />
                      </a>
                      <a href={profileData.portfolioUrl} className="text-gray-700 hover:text-gray-900">
                        <Globe className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Experience */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
              {isEditing && <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button>}
            </div>

            <div className="space-y-6">
              {profileData.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                      <p className="text-gray-600">{exp.company} • {exp.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                      <p className="text-gray-600 mt-2">{exp.description}</p>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Education */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Education</h3>
              {isEditing && <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button>}
            </div>

            <div className="space-y-6">
              {profileData.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.school} • {edu.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                      <p className="text-gray-600 mt-2">{edu.description}</p>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button onClick={addSkill} disabled={!newSkill.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
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
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Achievements</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add an achievement..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                  />
                  <Button onClick={addAchievement} disabled={!newAchievement.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {profileData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm flex-1">{achievement}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(achievement)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {profileData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start">
                    <Award className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{achievement}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Profile Completeness */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Strength</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Completeness</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
                <p className="text-xs text-gray-600">
                  Add portfolio projects to reach 100%
                </p>
              </div>
            </Card>

            {/* Job Preferences */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Preferences</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Expected Salary:</span>
                  <p className="text-gray-600">${Number(profileData.expectedSalary).toLocaleString()}/year</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-900">Work Mode:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profileData.workModes.map((mode) => (
                      <Badge key={mode} variant="outline" className="text-xs">{mode}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-900">Availability:</span>
                  <p className="text-gray-600 capitalize">{profileData.availability}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Open to Work:</span>
                  <Badge variant={profileData.isOpenToWork ? "default" : "secondary"}>
                    {profileData.isOpenToWork ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Resume & Documents */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Resume.pdf</p>
                      <p className="text-xs text-gray-500">Updated 2 days ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                {isEditing && (
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Update Resume
                  </Button>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Public Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Find Matching Jobs
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}