import { NextResponse } from 'next/server';
import { lookupBins } from '@/lib/binLookup';

export async function POST(req) {
  try {
    const body = await req.json();
    const { bulk, filters, limit } = body;

    // bulk could be an array of BINs or null if just filtering
    const results = await lookupBins(bulk, filters, limit);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
