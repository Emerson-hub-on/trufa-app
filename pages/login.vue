<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl shadow-pink-200 w-full max-w-sm p-8">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🍫</div>
        <h1 class="font-black text-rose-700 text-xl">Trufa Manager</h1>
        <p class="text-stone-500 text-sm mt-1">Entre na sua conta</p>
      </div>

      <div class="flex flex-col gap-4">
        <!-- Botão Google -->
        <button @click="entrarComGoogle" :disabled="loading"
          class="flex items-center justify-center gap-3 border border-stone-200 hover:bg-stone-50 disabled:opacity-50 font-bold rounded-full py-3 text-sm transition-colors text-stone-700 shadow-sm">
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>

        <div class="flex items-center gap-3">
          <div class="flex-1 h-px bg-pink-100"></div>
          <span class="text-xs text-stone-400 font-semibold">ou</span>
          <div class="flex-1 h-px bg-pink-100"></div>
        </div>

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

async function entrarComGoogle() {
  loading.value = true
  error.value = ''

  const { error: err } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (err) {
    error.value = 'Erro ao entrar com Google.'
    loading.value = false
  }
  // Se não der erro, o Supabase redireciona automaticamente para o Google
}

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