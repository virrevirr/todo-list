import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const TEST_USER_ID = '66b894a5-6557-4c57-a45d-33d5ac3f74e1'

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const cookieHeader = request.headers.get('cookie') ?? ''

  // ── supabase-server.ts ──────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  const { data: dbData, error: dbError } = await supabase.from('todos').select('*').limit(1)

  // ── middleware: unauthenticated request to protected route ──────────────
  // Fetch /dashboard with no cookies — middleware should redirect to /login
  const unauthRes = await fetch(`${origin}/dashboard`, {
    redirect: 'manual',
  })
  const middlewareBlocksUnauthenticated =
    unauthRes.status === 307 &&
    unauthRes.headers.get('location')?.includes('/login')

  // ── middleware: authenticated request to protected route ────────────────
  // Forward the current session cookies — middleware should allow through
  const authRes = await fetch(`${origin}/dashboard`, {
    redirect: 'manual',
    headers: { cookie: cookieHeader },
  })
  const middlewareAllowsAuthenticated = authRes.status !== 307

  // ── middleware: authenticated request to /login should redirect ─────────
  const loginRes = await fetch(`${origin}/login`, {
    redirect: 'manual',
    headers: { cookie: cookieHeader },
  })
  // Only relevant when logged in — middleware redirects to /dashboard
  const middlewareRedirectsAuthFromLogin =
    !user ||
    (loginRes.status === 307 && loginRes.headers.get('location')?.includes('/dashboard'))

  return NextResponse.json({
    'supabase-server': {
      client_created: true,
      user_authenticated: !authError && !!user,
      user_id: user?.id ?? null,
      user_matches_test_id: user?.id === TEST_USER_ID,
      db_connected: !dbError,
      db_error: dbError,
    },
    middleware: {
      blocks_unauthenticated_from_dashboard: middlewareBlocksUnauthenticated,
      allows_authenticated_to_dashboard: middlewareAllowsAuthenticated,
      redirects_authenticated_away_from_login: middlewareRedirectsAuthFromLogin,
    },
  })
}