<template>
  <div class="flex flex-col gap-4 sm:gap-5">

    <!-- Cards de stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-rose-400 mb-1">💰 Total</p>
        <p class="text-base sm:text-xl font-black text-rose-600">{{ formatCurrency(totalVendas) }}</p>
      </div>
      <div class="bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-200 rounded-2xl p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-1">📦 Unidades</p>
        <p class="text-base sm:text-xl font-black text-fuchsia-600">{{ totalUnidades }}</p>
      </div>
      <div class="bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-200 rounded-2xl p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">🧾 Registros</p>
        <p class="text-base sm:text-xl font-black text-orange-500">{{ vendasFiltradas.length }}</p>
      </div>
      <div class="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">📈 Ticket médio</p>
        <p class="text-base sm:text-xl font-black text-emerald-600">{{ formatCurrency(ticketMedio) }}</p>
      </div>
    </div>

    <!-- Tabela de vendas -->
    <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
      <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between gap-2 flex-wrap">
        <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">📋 Vendas</h2>
        <div class="flex gap-2">
          <button @click="$emit('exportarExcel')" class="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
            📊 Excel
          </button>
          <button @click="$emit('exportarPDF')" class="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
            📄 PDF
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm">
          <thead>
            <tr class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-500 border-b border-pink-50 bg-rose-50/40">
              <th class="text-left px-4 sm:px-5 py-3">Data</th>
              <th class="text-left px-4 sm:px-5 py-3">Produto</th>
              <th class="text-right px-4 sm:px-5 py-3">Qtd</th>
              <th class="text-right px-4 sm:px-5 py-3">Unit.</th>
              <th class="text-right px-4 sm:px-5 py-3">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-pink-50">
            <tr v-if="vendasFiltradas.length === 0">
              <td colspan="5" class="text-center py-10 text-stone-400 text-xs">Nenhuma venda no período.</td>
            </tr>
            <tr v-for="v in vendasFiltradas" :key="v.id" class="hover:bg-rose-50/40 transition-colors">
              <td class="px-4 sm:px-5 py-2.5 text-stone-600">{{ formatDateBR(v.data) }}</td>
              <td class="px-4 sm:px-5 py-2.5 font-semibold text-stone-700">{{ v.produto }}</td>
              <td class="px-4 sm:px-5 py-2.5 text-right text-stone-600">{{ v.quantidade }}</td>
              <td class="px-4 sm:px-5 py-2.5 text-right text-stone-600">{{ formatCurrency(v.valorUnit) }}</td>
              <td class="px-4 sm:px-5 py-2.5 text-right font-black text-rose-500">{{ formatCurrency(v.quantidade * v.valorUnit) }}</td>
            </tr>
          </tbody>
          <tfoot v-if="vendasFiltradas.length > 0">
            <tr class="border-t-2 border-rose-200 bg-rose-50/60">
              <td colspan="2" class="px-4 sm:px-5 py-3 font-black text-rose-700 text-xs uppercase tracking-wide">Total</td>
              <td class="px-4 sm:px-5 py-3 text-right font-black text-rose-700">{{ totalUnidades }}</td>
              <td class="px-4 sm:px-5 py-3"></td>
              <td class="px-4 sm:px-5 py-3 text-right font-black text-rose-600">{{ formatCurrency(totalVendas) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Por sabor -->
    <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
      <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">🍫 Por Sabor</h2>
      </div>
      <div class="divide-y divide-pink-50">
        <div v-if="porSabor.length === 0" class="text-center py-8 text-stone-400 text-xs">Sem dados no período.</div>
        <div v-for="s in porSabor" :key="s.nome" class="px-4 sm:px-5 py-3 flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <p class="font-bold text-stone-700 text-xs sm:text-sm truncate">{{ s.nome }}</p>
            <div class="mt-1.5 h-1.5 bg-pink-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500"
                :style="{ width: `${s.percentual}%` }"
              />
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="font-black text-rose-500 text-xs sm:text-sm">{{ formatCurrency(s.total) }}</p>
            <p class="text-[10px] text-stone-400">{{ s.unidades }} un · {{ s.percentual.toFixed(0) }}%</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRelatorioFormatar } from '~/composables/relatorios/useRelatorioFormatar'

defineProps<{
  vendasFiltradas: any[]
  totalVendas: number
  totalUnidades: number
  ticketMedio: number
  porSabor: { nome: string; total: number; unidades: number; percentual: number }[]
}>()

defineEmits<{
  exportarExcel: []
  exportarPDF: []
}>()

const { formatCurrency, formatDateBR } = useRelatorioFormatar()
</script>