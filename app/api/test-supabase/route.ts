import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  // Test authentication service
  const { data: authData, error: authError } =
    await supabase.auth.getSession()

  // Test database connection
  const { data: dbData, error: dbError } =
    await supabase.from('todos').select('*').limit(1)

  return NextResponse.json({
    auth: {
      success: !authError,
      data: authData,
      error: authError
    },
    database: {
      success: !dbError,
      data: dbData,
      error: dbError
    }
  })
}