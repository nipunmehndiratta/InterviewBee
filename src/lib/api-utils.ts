import { NextResponse } from 'next/server';
import { CustomSession } from './google-calendar';

export function checkAuth(session: CustomSession | null) {
  if (!session?.accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  return null;
}

export function createErrorResponse(error: unknown, message: string) {
  console.error(message, error);
  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
} 