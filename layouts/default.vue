<template>
  <div class="flex min-h-screen bg-rose-50/30">

    <!-- Overlay mobile -->
    <Transition name="fade">
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 bg-rose-950/20 backdrop-blur-sm z-30 lg:hidden"
        @click="mobileMenuOpen = false"
      />
    </Transition>

    <!-- Sidebar MOBILE -->
    <Transition name="slide">
      <aside
        v-if="mobileMenuOpen"
        class="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-rose-100 to-pink-50 border-r border-pink-200 z-40 flex flex-col lg:hidden"
      >
        <div class="flex items-center gap-2.5 px-4 py-5 border-b border-pink-200">
          <span class="text-2xl">🍫</span>
          <span class="font-black text-rose-700 text-sm">Trufa Manager</span>
          <button @click="mobileMenuOpen = false" class="ml-auto w-7 h-7 flex items-center justify-center rounded-lg border border-pink-300 text-rose-700 hover:bg-pink-200 transition-colors text-sm">✕</button>
        </div>
        <nav class="flex flex-col gap-1 p-2 pt-3 flex-1">
          <NuxtLink v-if="isAdmin" to="/admin" @click="mobileMenuOpen = false" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors" active-class="!bg-rose-400 !text-white">
            <span class="text-lg">👑</span> Admin
          </NuxtLink>
          <NuxtLink to="/" exact @click="mobileMenuOpen = false" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors" active-class="!bg-rose-400 !text-white">
            <span class="text-lg">🏠</span> Início
          </NuxtLink>
          <NuxtLink to="/vendas" @click="mobileMenuOpen = false" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors" active-class="!bg-rose-400 !text-white">
            <span class="text-lg">💸</span> Vendas
          </NuxtLink>
          <NuxtLink to="/sabores" @click="mobileMenuOpen = false" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors" active-class="!bg-rose-400 !text-white">
            <span class="text-lg">🍫</span> Sabores
          </NuxtLink>
          <NuxtLink to="/compras" @click="mobileMenuOpen = false" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors" active-class="!bg-rose-400 !text-white">
            <span class="text-lg">📦</span> Compras
          </NuxtLink>
          <NuxtLink to="/ficha-tecnica" @click="mobileMenuOpen = false" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors" active-class="!bg-rose-400 !text-white">
            <span class="text-lg">🧾</span> Ficha Técnica
          </NuxtLink>
          <NuxtLink to="/relatorio" @click="mobileMenuOpen = false" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors" active-class="!bg-rose-400 !text-white">
            <span class="text-lg">📊</span> Relatório
          </NuxtLink>
        </nav>

        <!-- Perfil/Logout mobile -->
        <div class="p-2 border-t border-pink-200">
          <button
            @click="logout"
            class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-700 hover:bg-rose-200/60 transition-colors"
          >
            <span class="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-base flex-shrink-0">👤</span>
            <div class="flex flex-col items-start min-w-0">
              <span class="text-xs font-black text-rose-700 truncate w-full">{{ userEmail }}</span>
              <span class="text-[10px] text-rose-400 font-semibold">Sair da conta</span>
            </div>
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Sidebar DESKTOP -->
    <aside
      class="hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen bg-gradient-to-b from-rose-100 to-pink-50 border-r border-pink-200 transition-all duration-250"
      :class="sidebarCollapsed ? 'w-16' : 'w-56'"
    >
      <div class="flex items-center gap-2.5 px-4 py-5 border-b border-pink-200">
        <span class="text-2xl flex-shrink-0">🍫</span>
        <span v-if="!sidebarCollapsed" class="font-black text-rose-700 text-sm whitespace-nowrap overflow-hidden">Trufa Manager</span>
        <button @click="sidebarCollapsed = !sidebarCollapsed" class="ml-auto flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg border border-pink-300 text-rose-700 hover:bg-pink-200 transition-colors text-xs">
          {{ sidebarCollapsed ? '›' : '‹' }}
        </button>
      </div>
      <nav class="flex flex-col gap-1 p-2 pt-3 flex-1">
        <NuxtLink v-if="isAdmin" to="/admin" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors whitespace-nowrap" active-class="!bg-rose-400 !text-white shadow-sm">
          <span class="text-lg flex-shrink-0">👑</span>
          <span v-if="!sidebarCollapsed">Admin</span>
        </NuxtLink>
        <NuxtLink to="/" exact class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors whitespace-nowrap" active-class="!bg-rose-400 !text-white shadow-sm">
          <span class="text-lg flex-shrink-0">🏠</span>
          <span v-if="!sidebarCollapsed">Início</span>
        </NuxtLink>
        <NuxtLink to="/vendas" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors whitespace-nowrap" active-class="!bg-rose-400 !text-white shadow-sm">
          <span class="text-lg flex-shrink-0">💸</span>
          <span v-if="!sidebarCollapsed">Vendas</span>
        </NuxtLink>
        <NuxtLink to="/sabores" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors whitespace-nowrap" active-class="!bg-rose-400 !text-white shadow-sm">
          <span class="text-lg flex-shrink-0">🍫</span>
          <span v-if="!sidebarCollapsed">Sabores</span>
        </NuxtLink>
        <NuxtLink to="/compras" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors whitespace-nowrap" active-class="!bg-rose-400 !text-white shadow-sm">
          <span class="text-lg flex-shrink-0">📦</span>
          <span v-if="!sidebarCollapsed">Compras</span>
        </NuxtLink>
        <NuxtLink to="/ficha-tecnica" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors whitespace-nowrap" active-class="!bg-rose-400 !text-white shadow-sm">
          <span class="text-lg flex-shrink-0">🧾</span>
          <span v-if="!sidebarCollapsed">Ficha Técnica</span>
        </NuxtLink>
        <NuxtLink to="/relatorio" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-pink-200/60 transition-colors whitespace-nowrap" active-class="!bg-rose-400 !text-white shadow-sm">
          <span class="text-lg flex-shrink-0">📊</span>
          <span v-if="!sidebarCollapsed">Relatório</span>
        </NuxtLink>
      </nav>

      <!-- Perfil/Logout desktop -->
      <div class="p-2 border-t border-pink-200">
        <button
          @click="logout"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-rose-200/60 transition-colors"
          :title="sidebarCollapsed ? 'Sair da conta' : ''"
        >
          <span class="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-base flex-shrink-0">👤</span>
          <div v-if="!sidebarCollapsed" class="flex flex-col items-start min-w-0 overflow-hidden">
            <span class="text-xs font-black text-rose-700 truncate w-full">{{ userEmail }}</span>
            <span class="text-[10px] text-rose-400 font-semibold">Sair da conta</span>
          </div>
        </button>
      </div>
    </aside>

    <!-- Conteúdo principal -->
    <div class="flex flex-col flex-1 min-w-0 w-full">
      <header class="flex items-center justify-between px-4 sm:px-6 py-4 bg-white border-b border-pink-100 sticky top-0 z-10 shadow-sm shadow-pink-50">
        <div class="flex items-center gap-3">
          <button
            @click="mobileMenuOpen = true"
            class="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-pink-200 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-sm sm:text-base font-black text-rose-700">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <span class="hidden sm:inline text-xs font-semibold text-rose-400 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full capitalize">{{ currentMonth }}</span>
          <button class="flex items-center gap-1.5 text-sm border border-pink-200 rounded-full px-2.5 py-1.5 text-rose-400 hover:bg-rose-50 transition-colors">
            🔔 <span class="bg-rose-400 text-white rounded-full px-1.5 text-xs font-black">2</span>
          </button>
        </div>
      </header>
      <main class="p-4 sm:p-6 flex-1 w-full max-w-full overflow-x-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const sidebarCollapsed = ref(false)
const mobileMenuOpen = ref(false)
const store = useTrufaStore()
const supabase = useSupabaseClient() as any
const isAdmin = ref(false)
const userEmail = ref('')

onMounted(() => {
  supabase.auth.getSession().then(async ({ data: { session } }: any) => {
    if (!session?.user?.id) return
    userEmail.value = session.user.email ?? ''
    await store.carregarDados(session.user.id)
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
    isAdmin.value = data?.role === 'admin'
  })
})

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/login')
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/admin': 'Admin',
  '/vendas': 'Vendas',
  '/sabores': 'Sabores',
  '/compras': 'Compras',
  '/ficha-tecnica': 'Ficha Técnica',
  '/relatorio': 'Relatório',
}

const pageTitle = computed(() => pageTitles[route.path] || 'Trufa Manager')
const currentMonth = computed(() => new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>