import { NextRequest, NextResponse } from 'next/server';
import { searchUsers } from '@/actions/search';

export async function GET(request: NextRequest) {
  try {
    // Get the search query from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const role = searchParams.get('role') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Use the server action to search users
    const result = await searchUsers(query, page, limit, role);
    
    // Handle errors
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    // Return the results
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in users search API:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}
