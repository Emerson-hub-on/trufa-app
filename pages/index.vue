<template>
  <div class="flex flex-col gap-4 sm:gap-5">

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <div class="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
        <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-rose-400 mb-1">💰 Lucro do Mês</p>
        <p class="text-xl sm:text-2xl font-black text-rose-600">{{ formatCurrency(store.lucro) }}</p>
      </div>

      <div class="bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
        <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-1">📈 Total Vendas</p>
        <p class="text-xl sm:text-2xl font-black text-fuchsia-600">{{ formatCurrency(store.totalVendas) }}</p>
      </div>

      <div class="bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
        <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">📉 Total Custos</p>
        <p class="text-xl sm:text-2xl font-black text-orange-500">{{ formatCurrency(store.totalCompras) }}</p>
      </div>
    </div>

    <!-- Info Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

      <!-- Produção -->
      <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
          <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">📦 Produção</h2>
        </div>

        <div class="divide-y divide-pink-50 text-xs sm:text-sm">
          <div class="flex justify-between px-4 sm:px-5 py-3">
            <span>Trufas produzidas</span>
            <span class="font-black text-rose-500">{{ store.totalTrufasProduzidas }}</span>
          </div>

          <div class="flex justify-between px-4 sm:px-5 py-3">
            <span>Custo médio</span>
            <span class="font-black text-rose-500">{{ formatCurrency(store.custoMedio) }}</span>
          </div>

          <div class="flex justify-between px-4 sm:px-5 py-3">
            <span>Fichas</span>
            <span class="font-black text-rose-500">{{ store.fichasTecnicas.length }}</span>
          </div>
        </div>
      </div>

      <!-- Mais vendida -->
      <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
          <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">🔥 Mais vendida</h2>
        </div>

        <div class="p-4 sm:p-5">
          <template v-if="store.maisVendida">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 pb-3 mb-3 border-b">
              <span class="font-black text-stone-800 text-sm sm:text-base">
                {{ store.maisVendida.produto }}
              </span>
              <span class="text-[10px] sm:text-xs font-bold bg-rose-100 text-rose-600 px-2 py-1 rounded-full w-fit">
                {{ store.maisVendida.vendas }} vendas
              </span>
            </div>

            <div v-for="v in recentVendas" :key="v.id"
              class="flex justify-between text-[11px] sm:text-xs py-1.5 text-stone-700">
              <span>{{ v.produto }}</span>
              <span class="font-bold text-rose-500">
                {{ v.quantidade }} × {{ formatCurrency(v.valorUnit) }}
              </span>
            </div>
          </template>

          <div v-else class="text-xs sm:text-sm text-stone-600 text-center py-4">
            Nenhuma venda ainda
          </div>
        </div>
      </div>
    </div>

    <!-- Acesso rápido -->
    <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
      <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">✨ Acesso rápido</h2>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm">
        <NuxtLink to="/vendas" class="p-4 flex flex-col items-center gap-2 hover:bg-rose-50">
          <span class="text-lg">💸</span>
          <span>Venda</span>
        </NuxtLink>

        <NuxtLink to="/compras" class="p-4 flex flex-col items-center gap-2 hover:bg-rose-50">
          <span class="text-lg">📦</span>
          <span>Compra</span>
        </NuxtLink>

        <NuxtLink to="/ficha-tecnica" class="p-4 flex flex-col items-center gap-2 hover:bg-rose-50">
          <span class="text-lg">🧾</span>
          <span>Fichas</span>
        </NuxtLink>

        <NuxtLink to="/relatorio" class="p-4 flex flex-col items-center gap-2 hover:bg-rose-50">
          <span class="text-lg">📊</span>
          <span>Relatório</span>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useTrufaStore } from '~/stores/trufa'

definePageMeta({ layout: 'default' })
const user = useSupabaseUser()

watchEffect(() => {
  console.log('USER:', user.value)
})

const store = useTrufaStore()
const recentVendas = computed(() => store.vendas.slice(0, 4))
watch(user, (u) => {
  if (u) {
    store.carregarDados()
  }
}, { immediate: true })

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { currency: 'BRL' })
}
</script>