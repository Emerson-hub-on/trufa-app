<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl shadow-pink-200 w-full max-w-sm p-8">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🍫</div>
        <h1 class="font-black text-rose-700 text-xl">Trufa Manager</h1>
        <p class="text-stone-500 text-sm mt-1">Entre na sua conta</p>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold uppercase tracking-widest text-stone-600">E-mail</label>
          <input v-model="form.email" type="email" placeholder="seu@email.com"
            class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Senha</label>
          <input v-model="form.password" type="password" placeholder="••••••••"
            class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
        </div>

        <p v-if="error" class="text-xs text-red-500 font-semibold text-center">{{ error }}</p>

        <button @click="entrar" :disabled="loading"
          class="bg-rose-400 hover:bg-rose-500 disabled:opacity-50 text-white font-black rounded-full py-3 text-sm transition-colors shadow-sm">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <button @click="cadastrar" :disabled="loading"
          class="border border-rose-300 text-rose-500 hover:bg-rose-50 font-bold rounded-full py-3 text-sm transition-colors">
          {{ loading ? '...' : 'Criar conta' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function entrar() {
  loading.value = true
  error.value = ''

  const { error: err } = await supabase.auth.signInWithPassword(form)

  if (err) {
    error.value = 'E-mail ou senha incorretos.'
    loading.value = false
    return
  }

  const user = useSupabaseUser()

  const stop = watch(user, (u) => {
    if (u) {
      stop()
      navigateTo('/')
    }
  })
}

async function cadastrar() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signUp(form)
  if (err) {
    error.value = err.message
  } else {
    navigateTo('/')
  }
  loading.value = false
}
</script>