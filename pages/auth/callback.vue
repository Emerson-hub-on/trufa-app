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
const user = useSupabaseUser()

onMounted(async () => {
  await supabase.auth.getSession()

  const stop = watch(user, async (u) => {
    if (!u) return
    stop()

    const { data: perfil } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', u.id)
      .single()

    if (!perfil) {
    await (supabase.from('profiles') as any).insert({
        id: u.id,
        email: u.email ?? '',
        role: 'user',
        ativo: true,
    })
    }

    navigateTo('/')
  }, { immediate: true })
})
</script>