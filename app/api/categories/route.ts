import { NextResponse } from 'next/server';
import { getCategories, hasData } from '@/lib/loadBonuses';

export async function GET() {
  try {
    const dataExists = await hasData();

    if (!dataExists) {
      return NextResponse.json(
        {
          error: 'No data available. Please run npm run fetch-data first.',
          categories: [],
        },
        { status: 404 }
      );
    }

    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', categories: [] },
      { status: 500 }
    );
  }
}
