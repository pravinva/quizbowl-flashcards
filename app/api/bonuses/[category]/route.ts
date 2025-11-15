import { NextRequest, NextResponse } from 'next/server';
import { loadBonusesByCategory, getRandomBonuses } from '@/lib/loadBonuses';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const random = searchParams.get('random') === 'true';

    let bonuses = await loadBonusesByCategory(category);

    if (bonuses.length === 0) {
      return NextResponse.json(
        { error: `No bonuses found for category: ${category}`, bonuses: [] },
        { status: 404 }
      );
    }

    if (random) {
      bonuses = getRandomBonuses(bonuses, limit);
    } else {
      bonuses = bonuses.slice(0, limit);
    }

    return NextResponse.json({ bonuses, count: bonuses.length });
  } catch (error) {
    console.error('Error fetching bonuses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bonuses', bonuses: [] },
      { status: 500 }
    );
  }
}
