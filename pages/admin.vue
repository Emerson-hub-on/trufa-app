<!-- pages/admin.vue -->
<template>
  <div class="flex flex-col gap-4">

    <!-- Formulário: Criar usuária -->
    <div class="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm">
      <div class="px-5 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <h2 class="font-black text-rose-700 text-sm uppercase tracking-wide">➕ Nova Usuária</h2>
      </div>

      <div class="p-5 flex flex-col sm:flex-row gap-3">
        <input v-model="novaUsuaria.email" type="email" placeholder="email@exemplo.com"
          class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300" />
        <input v-model="novaUsuaria.password" type="password" placeholder="Senha"
          class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-rose-300" />
        <select v-model="novaUsuaria.role"
          class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-rose-300">
          <option value="user">👤 Usuário</option>
          <option value="admin">👑 Admin</option>
        </select>
        <button @click="criarUsuaria" :disabled="criando"
          class="bg-rose-400 hover:bg-rose-500 disabled:opacity-50 text-white font-black rounded-full px-6 py-2.5 text-sm transition-colors shadow-sm whitespace-nowrap">
          {{ criando ? 'Criando...' : 'Criar' }}
        </button>
      </div>

      <p v-if="erroNova" class="px-5 pb-4 text-xs text-red-500 font-semibold">⚠️ {{ erroNova }}</p>
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
                <span :class="u.role === 'admin' ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-stone-100 text-stone-600'"
                  class="text-xs font-bold px-2 py-1 rounded-full">
                  {{ u.role === 'admin' ? '👑 Admin' : '👤 Usuária' }}
                </span>
              </td>
              <td class="px-5 py-3">
                <span :class="u.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-500'"
                  class="text-xs font-bold px-2 py-1 rounded-full">
                  {{ u.ativo ? 'Ativa' : 'Bloqueada' }}
                </span>
              </td>
              <td class="px-5 py-3 text-stone-600 text-xs">{{ formatDate(u.created_at) }}</td>
              <td class="px-5 py-3 flex gap-3">
                <button @click="abrirEdicao(u)"
                  class="text-xs font-bold text-rose-400 hover:text-rose-600 transition-colors">
                  ✏️ Editar
                </button>
                <button @click="toggleAtivo(u)"
                  :class="u.ativo ? 'text-red-400 hover:text-red-600' : 'text-emerald-500 hover:text-emerald-700'"
                  class="text-xs font-bold transition-colors">
                  {{ u.ativo ? 'Bloquear' : 'Ativar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de edição -->
    <Transition name="fade">
      <div v-if="editando"
        class="fixed inset-0 bg-rose-950/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">

          <div class="flex items-center justify-between">
            <h3 class="font-black text-rose-700 text-sm uppercase tracking-wide">✏️ Editar Usuária</h3>
            <button @click="editando = null" class="text-stone-400 hover:text-stone-600 text-lg">✕</button>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-500">E-mail</label>
              <p class="text-sm text-stone-500 px-1">{{ editando.email }}</p>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-500">
                Nova Senha
                <span class="text-stone-400 font-normal normal-case">(deixe vazio para não alterar)</span>
              </label>
              <input v-model="editando.novaSenha" type="password" placeholder="••••••••"
                class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-500">Perfil</label>
              <select v-model="editando.role"
                class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
                <option value="user">👤 Usuária</option>
                <option value="admin">👑 Admin</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <input v-model="editando.ativo" type="checkbox" id="ativo" class="accent-rose-400 w-4 h-4" />
              <label for="ativo" class="text-sm font-semibold text-stone-700">Conta ativa</label>
            </div>
          </div>

          <p v-if="erroEdicao" class="text-xs text-red-500 font-semibold">⚠️ {{ erroEdicao }}</p>

          <div class="flex gap-3 pt-1">
            <button @click="editando = null"
              class="flex-1 border border-pink-200 text-rose-500 font-bold rounded-full py-2.5 text-sm hover:bg-rose-50 transition-colors">
              Cancelar
            </button>
            <button @click="salvarEdicao" :disabled="salvando"
              class="flex-1 bg-rose-400 hover:bg-rose-500 disabled:opacity-50 text-white font-black rounded-full py-2.5 text-sm transition-colors">
              {{ salvando ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const supabase = useSupabaseClient() as any

const usuarios = ref<any[]>([])
const novaUsuaria = reactive({ email: '', password: '', role: 'user' })
const criando = ref(false)
const erroNova = ref('')
const sucessoNova = ref(false)

const editando = ref<any>(null)
const salvando = ref(false)
const erroEdicao = ref('')

onMounted(async () => {
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

async function carregarUsuarios() {
  const data = await $fetch('/api/admin/usuarios')
  usuarios.value = (data as any[]) ?? []
}

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
    await carregarUsuarios()
  } catch (err: any) {
    console.error('Erro completo:', err)
    erroNova.value = err?.data?.message ?? err?.message ?? 'Erro ao criar usuária.'
  } finally {
    criando.value = false
  }
}

function abrirEdicao(u: any) {
  editando.value = { ...u, novaSenha: '' }
  erroEdicao.value = ''
}

async function salvarEdicao() {
  erroEdicao.value = ''
  salvando.value = true
  try {
    await $fetch('/api/admin/atualizar-usuario', {
      method: 'POST',
      body: {
        id: editando.value.id,
        role: editando.value.role,
        ativo: editando.value.ativo,
        password: editando.value.novaSenha || undefined,
      },
    })
    const idx = usuarios.value.findIndex(u => u.id === editando.value.id)
    if (idx !== -1) usuarios.value[idx] = { ...usuarios.value[idx], ...editando.value }
    editando.value = null
  } catch (err: any) {
    erroEdicao.value = err?.data?.message ?? 'Erro ao salvar.'
  } finally {
    salvando.value = false
  }
}

async function toggleAtivo(u: any) {
  const novoStatus = !u.ativo
  await supabase.from('profiles').update({ ativo: novoStatus }).eq('id', u.id)
  u.ativo = novoStatus
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>