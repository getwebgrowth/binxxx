import { NextResponse } from 'next/server';
import { lookupBins } from '@/lib/binLookup';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req) {
  // 1. Resolve client IP address
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
             req.headers.get('x-real-ip') || 
             '127.0.0.1';

  // 2. Enforce Rate Limit (60 requests per minute)
  const rateLimit = checkRateLimit(ip, 60, 60000);
  
  const headers = {
    'X-RateLimit-Limit': rateLimit.limit.toString(),
    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
    'X-RateLimit-Reset': rateLimit.reset.toString(),
  };

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Search endpoint limit is 60 queries per minute to prevent scraping.',
        reset: rateLimit.reset
      },
      { status: 429, headers }
    );
  }

  try {
    const body = await req.json();
    const { bulk, filters, limit } = body;

    // 3. Security: Enforce a strict ceiling limit of 100 on DB output
    const cappedLimit = Math.min(parseInt(limit) || 100, 100);

    // bulk could be an array of BINs or null if just filtering
    const results = await lookupBins(bulk, filters, cappedLimit);

    return NextResponse.json({ results }, { headers });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers });
  }
}
