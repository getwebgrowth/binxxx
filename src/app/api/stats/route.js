import { NextResponse } from 'next/server';
import { initDb, dbRows } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    return NextResponse.json({
      totalBins: dbRows.length
    });
  } catch (error) {
    console.error("API Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
