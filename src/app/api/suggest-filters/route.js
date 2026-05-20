import { NextResponse } from 'next/server';
import { getSuggestions } from '@/lib/suggestFilters';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'bank';
    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || '';

    const suggestions = await getSuggestions({ type, search, country });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("API Suggest Filters Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
