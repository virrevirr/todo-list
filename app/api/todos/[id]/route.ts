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
  const body = await request.json()
  const { completed, title } = body

  if (completed !== undefined && typeof completed !== 'boolean') {
    return NextResponse.json({ error: 'completed must be a boolean' }, { status: 400 })
  }
  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return NextResponse.json({ error: 'title must be a non-empty string' }, { status: 400 })
  }

  // Verify the todo exists and belongs to the user via list ownership
  const { data: existing } = await supabase
    .from('todos')
    .select('id, list_id')
    .eq('id', id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }

  const { data: list } = await supabase
    .from('lists')
    .select('id')
    .eq('id', existing.list_id)
    .eq('user_id', user.id)
    .single()

  if (!list) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }

  const updates: Record<string, unknown> = {}
  if (completed !== undefined) updates.completed = completed
  if (title !== undefined) updates.title = title.trim()

  const { data: todo, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(todo)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const { data: existing } = await supabase
    .from('todos')
    .select('id, list_id')
    .eq('id', id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }

  const { data: list } = await supabase
    .from('lists')
    .select('id')
    .eq('id', existing.list_id)
    .eq('user_id', user.id)
    .single()

  if (!list) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }

  await supabase.from('todos').delete().eq('id', id)

  return new NextResponse(null, { status: 204 })
}
