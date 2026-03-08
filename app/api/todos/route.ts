import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const listId = request.nextUrl.searchParams.get('list_id')

  if (!listId) {
    return NextResponse.json({ error: 'list_id is required' }, { status: 400 })
  }

  // Verify the list exists and belongs to the authenticated user
  // This prevents users from accessing todos from lists they don't own
  const { data: list } = await supabase
    .from('lists')
    .select('id')
    .eq('id', listId)
    .eq('user_id', user.id)
    .single()

  if (!list) {
    return NextResponse.json({ error: 'List not found' }, { status: 404 })
  }

  // Fetch todos for the verified list in chronological order
  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(todos)
}
