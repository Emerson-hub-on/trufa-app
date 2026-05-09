import type { Database } from '~/types/database'

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient<Database>()

  if (to.path === '/login' || to.path === '/auth/callback') return

  if (!user.value) return navigateTo('/login')

  const { data } = await supabase
    .from('profiles')
    .select('ativo, role')
    .eq('id', user.value.id)
    .single()

  const perfil = data as { ativo: boolean; role: string } | null

  if (!perfil || !perfil.ativo) {
    await supabase.auth.signOut()
    return navigateTo('/login')
  }
})