<template>
  <div class="flex flex-col gap-4">

    <!-- Formulário: Criar usuária -->
    <div class="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm">
      <div class="px-5 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <h2 class="font-black text-rose-700 text-sm uppercase tracking-wide">➕ Nova Usuária</h2>
      </div>

      <div class="p-5 flex flex-col sm:flex-row gap-3">
        <input
          v-model="novaUsuaria.email"
          type="email"
          placeholder="email@exemplo.com"
          class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <input
          v-model="novaUsuaria.password"
          type="password"
          placeholder="Senha"
          class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <select
          v-model="novaUsuaria.role"
          class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <option value="user">👤 Usuária</option>
          <option value="admin">👑 Admin</option>
        </select>
        <button
          @click="criarUsuaria"
          :disabled="criando"
          class="bg-rose-400 hover:bg-rose-500 disabled:opacity-50 text-white font-black rounded-full px-6 py-2.5 text-sm transition-colors shadow-sm whitespace-nowrap"
        >
          {{ criando ? 'Criando...' : 'Criar' }}
        </button>
      </div>

      <p v-if="erroNova" class="px-5 pb-4 text-xs text-red-500 font-semibold">{{ erroNova }}</p>
      <p v-if="sucessoNova" class="px-5 pb-4 text-xs text-emerald-600 font-semibold">✅ Usuária criada com sucesso!</p>
    </div>

    <!-- Tabela: Gerenciar usuárias -->
    <div class="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm">
      <div class="px-5 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <h2 class="font-black text-rose-700 text-sm uppercase tracking-wide">👑 Gerenciar Usuárias</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs font-bold uppercase tracking-widest text-stone-600 border-b border-pink-50">
              <th class="text-left px-5 py-3">E-mail</th>
              <th class="text-left px-5 py-3">Perfil</th>
              <th class="text-left px-5 py-3">Status</th>
              <th class="text-left px-5 py-3">Cadastro</th>
              <th class="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-pink-50">
            <tr v-if="usuarios.length === 0">
              <td colspan="5" class="text-center py-8 text-stone-400">Nenhuma usuária encontrada</td>
            </tr>
            <tr v-for="u in usuarios" :key="u.id" class="hover:bg-rose-50/50 transition-colors">
              <td class="px-5 py-3 font-bold text-stone-700">{{ u.email }}</td>
              <td class="px-5 py-3">
                <span
                  :class="u.role === 'admin' ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-stone-100 text-stone-600'"
                  class="text-xs font-bold px-2 py-1 rounded-full"
                >
                  {{ u.role === 'admin' ? '👑 Admin' : '👤 Usuária' }}
                </span>
              </td>
              <td class="px-5 py-3">
                <span
                  :class="u.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-500'"
                  class="text-xs font-bold px-2 py-1 rounded-full"
                >
                  {{ u.ativo ? 'Ativa' : 'Bloqueada' }}
                </span>
              </td>
              <td class="px-5 py-3 text-stone-600 text-xs">{{ formatDate(u.created_at) }}</td>
              <td class="px-5 py-3 flex gap-2">
                <button
                  @click="toggleAtivo(u)"
                  :class="u.ativo ? 'text-red-400 hover:text-red-600' : 'text-emerald-500 hover:text-emerald-700'"
                  class="text-xs font-bold transition-colors"
                >
                  {{ u.ativo ? 'Bloquear' : 'Ativar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const supabase = useSupabaseClient() as any
const user = useSupabaseUser()

const usuarios = ref<any[]>([])


// ── Aguarda sessão antes de verificar role ──────────────────
onMounted(async () => {
  // Pega a sessão diretamente (não depende do ref reativo)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    navigateTo('/login')
    return
  }

  const { data: perfil } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (perfil?.role !== 'admin') {
    navigateTo('/')
    return
  }

  await carregarUsuarios()
})

// ── Criar usuária ───────────────────────────────────────────
const novaUsuaria = reactive({ email: '', password: '', role: 'user' })
const criando = ref(false)
const erroNova = ref('')
const sucessoNova = ref(false)

async function criarUsuaria() {
  erroNova.value = ''
  sucessoNova.value = false

  if (!novaUsuaria.email || !novaUsuaria.password) {
    erroNova.value = 'Preencha e-mail e senha.'
    return
  }

  criando.value = true

  try {
    await $fetch('/api/admin/criar-usuario', {
      method: 'POST',
      body: {
        email: novaUsuaria.email,
        password: novaUsuaria.password,
        role: novaUsuaria.role,
      },
    })

    sucessoNova.value = true
    novaUsuaria.email = ''
    novaUsuaria.password = ''
    novaUsuaria.role = 'user'

    // Recarrega a lista para mostrar a nova usuária
    await carregarUsuarios()
  } catch (err: any) {
    erroNova.value = err?.data?.message ?? 'Erro ao criar usuária.'
  } finally {
    criando.value = false
  }
}

// ── Carregar lista ──────────────────────────────────────────
async function carregarUsuarios() {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  usuarios.value = data ?? []
}

onMounted(async () => {
  const { data: perfil } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.value?.id)
    .single()

  if (perfil?.role !== 'admin') {
    navigateTo('/')
    return
  }

  await carregarUsuarios()
})

// ── Bloquear / Ativar ───────────────────────────────────────
async function toggleAtivo(u: any) {
  const novoStatus = !u.ativo
  await supabase.from('profiles').update({ ativo: novoStatus }).eq('id', u.id)
  u.ativo = novoStatus
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}
</script>