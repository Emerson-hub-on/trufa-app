<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center">
    <div class="text-center">
      <div class="text-4xl mb-3">🍫</div>
      <p class="text-rose-500 font-bold text-sm">Autenticando...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/database'

definePageMeta({ layout: false })

const supabase = useSupabaseClient<Database>()

onMounted(async () => {
  // Processa o code da URL diretamente, sem depender do watch
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session?.user) {
    // Tenta trocar o code por sessão (PKCE flow)
    const { data: { session: s2 }, error: e2 } = await supabase.auth.exchangeCodeForSession(
      window.location.href
    )

    if (e2 || !s2?.user) {
      navigateTo('/login')
      return
    }

    await garantirPerfil(s2.user)
    navigateTo('/')
    return
  }

  await garantirPerfil(session.user)
  navigateTo('/')
})

async function garantirPerfil(user: { id: string; email?: string }) {
  const { data: perfil } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!perfil) {
    await (supabase.from('profiles') as any).insert({
      id: user.id,
      email: user.email ?? '',
      role: 'user',
      ativo: true,
    })
  }
}
</script>