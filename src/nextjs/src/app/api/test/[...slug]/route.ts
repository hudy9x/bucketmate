import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: { slug: string[] } }) {
  return NextResponse.json({
    method: 'GET',
    slug: context.params.slug,
    message: 'GET success'
  });
}

export async function POST(request: NextRequest, context: { params: { slug: string[] } }) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    // ignore body parse errors for dummy endpoint
  }
  return NextResponse.json({
    method: 'POST',
    slug: context.params.slug,
    message: 'POST success',
    body
  });
}
