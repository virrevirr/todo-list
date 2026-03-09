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

  const updates: Record<string, unknown> = {}
  if (completed !== undefined) updates.completed = completed
  if (title !== undefined) updates.title = title.trim()

  const { data: todo, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error || !todo) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
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

  await supabase.from('todos').delete().eq('id', id)

  return new NextResponse(null, { status: 204 })
}
