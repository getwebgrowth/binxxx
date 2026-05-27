import { NextResponse } from 'next/server';
import { lookupBins } from '@/lib/binLookup';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(request, { params }) {
  // 1. Resolve client IP address
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1';

  // 2. Perform Rate Limit Verification (10 requests per minute)
  const rateLimit = checkRateLimit(ip, 10, 60000);
  
  const headers = {
    'X-RateLimit-Limit': rateLimit.limit.toString(),
    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
    'X-RateLimit-Reset': rateLimit.reset.toString(),
    'Access-Control-Allow-Origin': '*', // Enable public accessibility
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Standard public endpoint limit is 10 queries per minute to prevent scraping.',
        reset: rateLimit.reset
      },
      { status: 429, headers }
    );
  }

  try {
    const { number } = params;

    // 3. Input Validation
    if (!number || !/^\d{6,8}$/.test(number)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bad Request',
          message: 'Invalid BIN number length. Card prefix must be exactly 6, 7, or 8 numeric digits.'
        },
        { status: 400, headers }
      );
    }

    // 4. Query the BIN lookup engine
    const results = await lookupBins([number]);
    const cardData = results && results.length > 0 ? results[0] : null;

    if (!cardData || cardData.error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not Found',
          message: `The card BIN prefix "${number}" was not found in our database records.`
        },
        { status: 404, headers }
      );
    }

    // 5. Structure clean response matching modern standards (e.g. binlist.net structure)
    const payload = {
      success: true,
      bin: cardData.bin,
      scheme: cardData.brand ? cardData.brand.toLowerCase() : 'unknown',
      type: cardData.type ? cardData.type.toLowerCase() : 'unknown',
      brand: cardData.level ? cardData.level.toUpperCase() : 'unknown',
      bank: {
        name: cardData.bank || 'Unknown Bank',
        phone: cardData.phone || null,
        url: cardData.url || null
      },
      country: {
        name: cardData.country || 'Unknown Country',
        code: cardData.countryCode || 'N/A',
        flag: cardData.flag || ''
      }
    };

    return NextResponse.json(payload, { status: 200, headers });
  } catch (error) {
    console.error("Public API Error:", error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', message: 'An unexpected database error occurred.' },
      { status: 500, headers }
    );
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  });
}
