import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handleCronWork(request);
}

export async function POST(request: Request) {
  return handleCronWork(request);
}

async function handleCronWork(request: Request) {
  // 1. Explicit configuration flag: Keep notifications disabled independently of service-role key
  if (process.env.ENABLE_NOTIFICATIONS !== 'true') {
    return NextResponse.json({
      status: "disabled",
      message: "Notification cron worker is disabled by configuration (ENABLE_NOTIFICATIONS != 'true').",
      processed: 0,
      timestamp: new Date().toISOString(),
    });
  }

  // 2. Strict Authentication Guard: Require valid secret. No x-vercel-cron bypass.
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const isValidBearer = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);

  if (!isValidBearer) {
    return NextResponse.json(
      { error: 'Unauthorized cron invocation. Valid Bearer CRON_SECRET is strictly required.' },
      { status: 401 }
    );
  }

  // 3. Database credentials check
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Supabase service-role credentials not configured.' },
      { status: 500 }
    );
  }

  const { processDueNotificationJobs } = await import('@/lib/email/worker');
  const results = await processDueNotificationJobs(20);

  return NextResponse.json({
    message: `Processed notification jobs successfully`,
    results,
    timestamp: new Date().toISOString(),
  });
}
