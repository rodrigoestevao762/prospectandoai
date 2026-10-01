export const runtime = 'edge';
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    hasOutscraper: !!process.env.OUTSCRAPER_API_KEY,
    keyLength: process.env.OUTSCRAPER_API_KEY ? process.env.OUTSCRAPER_API_KEY.length : 0
  });
}
