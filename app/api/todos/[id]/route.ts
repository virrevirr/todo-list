import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { completed } = await request.json()

  if (typeof completed !== 'boolean') {
    return NextResponse.json({ error: 'completed must be a boolean' }, { status: 400 })
  }

  // Verify the todo belongs to the authenticated user via list ownership
  const { data: existing } = await supabase
    .from('todos')
    .select('id, list_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }

  const { data: todo, error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(todo)
}
