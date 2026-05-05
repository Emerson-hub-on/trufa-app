<template>
  <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
    <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
      <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">🔍 Filtros</h2>
    </div>

    <div class="p-4 sm:p-5 flex flex-col gap-3">

      <div class="flex items-center gap-2">
        <label class="text-xs font-bold text-stone-500 whitespace-nowrap">Relatório</label>
        <select
          :value="tipoRelatorio"
          @change="$emit('update:tipoRelatorio', ($event.target as HTMLSelectElement).value)"
          class="border border-pink-200 rounded-xl px-3 py-2 text-xs sm:text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300 font-semibold text-stone-700"
        >
          <option value="vendas">💸 Vendas</option>
          <option value="compras">📦 Compras</option>
          <option value="rendimento">📈 Rendimento</option>
          <option value="sabores">🍫 Sabores</option>
          <option value="fichas">🧾 Ficha Técnica</option>
        </select>
      </div>

      <template v-if="tipoRelatorio !== 'fichas' && tipoRelatorio !== 'sabores'">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="p in periodos" :key="p.label"
            @click="$emit('aplicarPeriodo', p)"
            :class="periodoAtivo === p.label ? 'bg-rose-400 text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'"
            class="text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
          >
            {{ p.label }}
          </button>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div class="flex items-center gap-2 flex-1 w-full">
            <label class="text-xs font-bold text-stone-500 whitespace-nowrap">De</label>
            <input
              :value="filtro.de"
              @input="$emit('update:filtro', { ...filtro, de: ($event.target as HTMLInputElement).value })"
              type="date"
              class="border border-pink-200 rounded-xl px-3 py-2 text-xs sm:text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
          <div class="flex items-center gap-2 flex-1 w-full">
            <label class="text-xs font-bold text-stone-500 whitespace-nowrap">Até</label>
            <input
              :value="filtro.ate"
              @input="$emit('update:filtro', { ...filtro, ate: ($event.target as HTMLInputElement).value })"
              type="date"
              class="border border-pink-200 rounded-xl px-3 py-2 text-xs sm:text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
          <div v-if="tipoRelatorio === 'vendas'" class="flex items-center gap-2 w-full sm:w-auto">
            <label class="text-xs font-bold text-stone-500 whitespace-nowrap">Sabor</label>
            <select
              :value="filtro.sabor"
              @change="$emit('update:filtro', { ...filtro, sabor: ($event.target as HTMLSelectElement).value })"
              class="border border-pink-200 rounded-xl px-3 py-2 text-xs sm:text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <option value="">Todos</option>
              <option v-for="s in sabores" :key="s.id" :value="s.nome">{{ s.nome }}</option>
            </select>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tipoRelatorio: string
  filtro: { de: string; ate: string; sabor: string }
  periodoAtivo: string
  periodos: { label: string; de: () => string; ate: () => string }[]
  sabores: { id: string; nome: string }[]
}>()

defineEmits<{
  'update:tipoRelatorio': [value: string]
  'update:filtro': [value: { de: string; ate: string; sabor: string }]
  'aplicarPeriodo': [p: { label: string; de: () => string; ate: () => string }]
}>()
</script>