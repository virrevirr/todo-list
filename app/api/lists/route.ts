import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Step 1: verify session — reject unauthenticated requests
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Step 2: query only this user's lists
  // Supabase RLS enforces user_id filtering at the DB level,
  // but we also filter explicitly here as a safety net
  const { data: lists, error } = await supabase
    .from('lists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Step 3: return the results
  return NextResponse.json(lists)
}
