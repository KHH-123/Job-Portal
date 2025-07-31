'use client';

import { useState } from 'react';
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
import { Upload, Save, Eye, Building, Globe, MapPin, Users, Calendar, Camera } from 'lucide-react';

export default function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: 'TechCorp Inc.',
    tagline: 'Building the future of technology',
    description: 'TechCorp is a leading technology company focused on building innovative solutions for modern businesses. We specialize in web applications, mobile development, and cloud infrastructure.',
    industry: 'Technology',
    size: '100-500',
    founded: '2018',
    location: 'San Francisco, CA',
    website: 'https://techcorp.com',
    linkedinUrl: 'https://linkedin.com/company/techcorp',
    twitterUrl: 'https://twitter.com/techcorp',
    logo: 'https://placehold.co/120x120/3b82f6/ffffff?text=TC',
    coverImage: 'https://placehold.co/800x300/1e40af/ffffff?text=TechCorp+Office',
    benefits: [
      'Competitive salary and equity',
      'Comprehensive health insurance',
      'Flexible work arrangements',
      '$2,000 annual learning budget',
      'Unlimited PTO',
      'Team retreats'
    ],
    values: [
      { title: 'Innovation', description: 'We embrace new ideas and technologies' },
      { title: 'Collaboration', description: 'We work together to achieve great things' },
      { title: 'Excellence', description: 'We strive for the highest quality in everything we do' },
      { title: 'Growth', description: 'We invest in our people and their development' }
    ],
    perks: 'Free lunch, gym membership, flexible hours, remote work options, pet-friendly office',
    culture: 'We believe in work-life balance and creating an environment where everyone can do their best work.',
    offices: [
      { city: 'San Francisco', address: '123 Tech Street, San Francisco, CA 94105', isHeadquarters: true },
      { city: 'New York', address: '456 Innovation Ave, New York, NY 10001', isHeadquarters: false }
    ]
  });

  const [newBenefit, setNewBenefit] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !companyData.benefits.includes(newBenefit.trim())) {
      setCompanyData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    setCompanyData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your company profile to attract top talent
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
          {/* Company Header */}
          <Card className="p-6">
            <div className="relative">
              {/* Cover Image */}
              <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
                <img
                  src={companyData.coverImage}
                  alt="Company cover"
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Button variant="secondary" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Cover
                    </Button>
                  </div>
                )}
              </div>

              {/* Company Logo */}
              <div className="absolute -bottom-12 left-6">
                <div className="relative">
                  <img
                    src={companyData.logo}
                    alt="Company logo"
                    className="w-24 h-24 rounded-lg bg-white border-4 border-white shadow-lg"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <Button variant="secondary" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-16">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={companyData.tagline}
                      onChange={(e) => handleInputChange('tagline', e.target.value)}
                      placeholder="A brief tagline that describes your company"
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{companyData.name}</h2>
                  <p className="text-gray-600 mt-1">{companyData.tagline}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {companyData.industry}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {companyData.size} employees
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Founded {companyData.founded}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Company Information */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={companyData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="size">Company Size</Label>
                    <Select value={companyData.size} onValueChange={(value) => handleInputChange('size', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-100">51-100 employees</SelectItem>
                        <SelectItem value="100-500">100-500 employees</SelectItem>
                        <SelectItem value="500-1000">500-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input
                      id="founded"
                      value={companyData.founded}
                      onChange={(e) => handleInputChange('founded', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Headquarters</Label>
                    <Input
                      id="location"
                      value={companyData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={companyData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={companyData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{companyData.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Industry:</span>
                    <span className="ml-2 text-gray-600">{companyData.industry}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Size:</span>
                    <span className="ml-2 text-gray-600">{companyData.size} employees</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Founded:</span>
                    <span className="ml-2 text-gray-600">{companyData.founded}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Website:</span>
                    <a href={companyData.website} className="ml-2 text-blue-600 hover:text-blue-800">
                      {companyData.website}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Benefits & Perks */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Add a benefit..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  />
                  <Button onClick={addBenefit} disabled={!newBenefit.trim()}>
                    Add
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {companyData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{benefit}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBenefit(benefit)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {companyData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{benefit}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Company Values */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyData.values.map((value, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completeness</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Profile Strength</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
                <p className="text-xs text-gray-600">
                  Add more photos and details to reach 100%
                </p>
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
              
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="linkedinUrl">LinkedIn</Label>
                    <Input
                      id="linkedinUrl"
                      value={companyData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitterUrl">Twitter</Label>
                    <Input
                      id="twitterUrl"
                      value={companyData.twitterUrl}
                      onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <a href={companyData.linkedinUrl} className="flex items-center text-blue-600 hover:text-blue-800">
                    <Globe className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                  <a href={companyData.twitterUrl} className="flex items-center text-blue-600 hover:text-blue-800">
                    <Globe className="h-4 w-4 mr-2" />
                    Twitter
                  </a>
                </div>
              )}
            </Card>

            {/* Office Locations */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Locations</h3>
              
              <div className="space-y-3">
                {companyData.offices.map((office, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900">{office.city}</h4>
                      {office.isHeadquarters && (
                        <Badge variant="secondary" className="ml-2 text-xs">HQ</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{office.address}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}