import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Briefcase, Building2, Users, Star, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="bg-gray-50">
      {/* Header Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Find your dream job now
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              5 lakh+ jobs for you to explore
            </p>
          </div>
          
          {/* Search Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    placeholder="Job title or keyword"
                    className="pl-10 h-12 border-gray-200 bg-gray-50"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    placeholder="Location"
                    className="pl-10 h-12 border-gray-200 bg-gray-50"
                  />
                </div>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select className="w-full h-12 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Experience</option>
                    <option>0-1 years</option>
                    <option>2-4 years</option>
                    <option>5-10 years</option>
                    <option>10+ years</option>
                  </select>
                </div>
                <a href="/jobs">
                  <Button className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended Jobs
              </h2>
              <p className="text-gray-600 mt-1">Based on your profile</p>
            </div>
          </div>
          
          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Job Card 1 */}
            <Card className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Full-time
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Senior Frontend Developer
              </h3>
              <p className="text-sm text-gray-600 mb-2">TechCorp Inc.</p>
              <p className="text-sm text-gray-500 mb-4">San Francisco, CA • Remote</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">$120k - $160k</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.8</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">React</Badge>
                <Badge variant="outline" className="text-xs">TypeScript</Badge>
                <Badge variant="outline" className="text-xs">Next.js</Badge>
              </div>
            </Card>

            {/* Job Card 2 */}
            <Card className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Contract
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Product Manager
              </h3>
              <p className="text-sm text-gray-600 mb-2">StartupXYZ</p>
              <p className="text-sm text-gray-500 mb-4">New York, NY • Hybrid</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">$100k - $140k</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.6</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">Strategy</Badge>
                <Badge variant="outline" className="text-xs">Analytics</Badge>
                <Badge variant="outline" className="text-xs">Agile</Badge>
              </div>
            </Card>

            {/* Job Card 3 */}
            <Card className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Part-time
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                UX Designer
              </h3>
              <p className="text-sm text-gray-600 mb-2">DesignStudio</p>
              <p className="text-sm text-gray-500 mb-4">Remote</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">$80k - $110k</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.9</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">Figma</Badge>
                <Badge variant="outline" className="text-xs">Prototyping</Badge>
                <Badge variant="outline" className="text-xs">Research</Badge>
              </div>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <a href="/jobs">
              <Button size="lg" variant="outline">
                View All Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>
      



      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Ready to find your dream job?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join millions of job seekers and find your perfect career opportunity today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/sign-up">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="/jobs">
              <Button size="lg" variant="outline" className="px-8">
                Browse Jobs
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
