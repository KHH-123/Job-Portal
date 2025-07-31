import { db } from '@/lib/db/drizzle';
import { companies, jobs } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, Briefcase, ExternalLink } from 'lucide-react';
import Link from 'next/link';

async function getCompanies() {
  try {
    const result = await db
      .select({
        id: companies.id,
        name: companies.name,
        description: companies.description,
        logo: companies.logo,
        website: companies.website,
        industry: companies.industry,
        size: companies.size,
        location: companies.location,
        jobCount: count(jobs.id)
      })
      .from(companies)
      .leftJoin(jobs, eq(companies.id, jobs.companyId))
      .groupBy(companies.id)
      .orderBy(companies.name);

    return result;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-2">Discover {companies.length} companies hiring on our platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {company.name}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {company.description || 'No description available'}
                    </p>

                    {/* Company Details */}
                    <div className="mt-4 space-y-2">
                      {company.industry && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Building2 className="w-4 h-4 mr-2" />
                          {company.industry}
                        </div>
                      )}
                      
                      {company.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2" />
                          {company.location}
                        </div>
                      )}
                      
                      {company.size && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-2" />
                          {company.size}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {company.jobCount} open {company.jobCount === 1 ? 'position' : 'positions'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        href={`/jobs?company=${company.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Jobs ({company.jobCount})
                      </Link>
                      
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No companies found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Companies will appear here once they start posting jobs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
