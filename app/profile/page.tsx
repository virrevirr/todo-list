import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import ProfileForm from '@/components/profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single()

  const initials = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .map(n => n![0].toUpperCase())
    .join('') || user.email![0].toUpperCase()

  return (
    <ProfileForm
      initials={initials}
      firstName={profile?.first_name ?? ''}
      lastName={profile?.last_name ?? ''}
      email={user.email!}
    />
  )
}
