import { NextRequest, NextResponse } from 'next/server';
import { getAdvancedJobSeekerReports } from '@/app/actions/reports';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get('range') || '30d') as '7d' | '30d' | '90d' | '6m' | '1y';
    const type = (searchParams.get('type') || 'overview') as 'overview' | 'performance' | 'trends' | 'comparative';
    
    const reports = await getAdvancedJobSeekerReports(range, type);
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Reports API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Only job seekers')) {
        return NextResponse.json(
          { error: 'Unauthorized - job seekers only' }, 
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch reports' }, 
      { status: 500 }
    );
  }
}