import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { first_name, last_name } = await request.json()

  const lettersOnly = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/
  if (!first_name || typeof first_name !== 'string' || !lettersOnly.test(first_name) || first_name.length > 50)
    return NextResponse.json({ error: 'Invalid first name.' }, { status: 400 })
  if (!last_name || typeof last_name !== 'string' || !lettersOnly.test(last_name) || last_name.length > 50)
    return NextResponse.json({ error: 'Invalid last name.' }, { status: 400 })

  const { error } = await supabase
    .from('profiles')
    .update({ first_name, last_name })
    .eq('id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase.rpc('delete_user')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
