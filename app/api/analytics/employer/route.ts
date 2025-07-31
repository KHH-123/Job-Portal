import { NextRequest, NextResponse } from 'next/server';
import { getEmployerAnalytics } from '@/app/actions/analytics';

export async function GET(request: NextRequest) {
  try {
    const analytics = await getEmployerAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Only employers')) {
        return NextResponse.json(
          { error: 'Unauthorized - employers only' }, 
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch analytics' }, 
      { status: 500 }
    );
  }
}