<template>
  <div class="flex flex-col gap-4 sm:gap-5">

    <!-- Cards de stats -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div class="bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-200 rounded-2xl p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-1">📈 Vendas</p>
        <p class="text-base sm:text-xl font-black text-fuchsia-600">{{ formatCurrency(totalVendas) }}</p>
      </div>
      <div class="bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-200 rounded-2xl p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">📉 Compras</p>
        <p class="text-base sm:text-xl font-black text-orange-500">{{ formatCurrency(totalCompras) }}</p>
      </div>
      <div
        :class="rendimento >= 0 ? 'from-emerald-50 to-teal-50 border-emerald-200' : 'from-red-50 to-rose-50 border-red-200'"
        class="col-span-2 sm:col-span-1 bg-gradient-to-br rounded-2xl p-3 sm:p-4 border"
      >
        <p
          :class="rendimento >= 0 ? 'text-emerald-500' : 'text-red-400'"
          class="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1"
        >
          {{ rendimento >= 0 ? '💰 Lucro' : '⚠️ Prejuízo' }}
        </p>
        <p :class="rendimento >= 0 ? 'text-emerald-600' : 'text-red-500'" class="text-base sm:text-xl font-black">
          {{ formatCurrency(rendimento) }}
        </p>
      </div>
    </div>

    <!-- Tabela de rendimento -->
    <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
      <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between gap-2 flex-wrap">
        <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">📈 Rendimento</h2>
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
              <th class="text-left px-4 sm:px-5 py-3">Tipo</th>
              <th class="text-left px-4 sm:px-5 py-3">Descrição</th>
              <th class="text-left px-4 sm:px-5 py-3">Data</th>
              <th class="text-right px-4 sm:px-5 py-3">Valor</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-pink-50">
            <tr v-if="itensRendimento.length === 0">
              <td colspan="4" class="text-center py-10 text-stone-400 text-xs">Sem dados no período.</td>
            </tr>
            <tr v-for="(item, i) in itensRendimento" :key="i" class="hover:bg-rose-50/40 transition-colors">
              <td class="px-4 sm:px-5 py-2.5">
                <span
                  :class="item.tipo === 'Venda' ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-orange-100 text-orange-600'"
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                >
                  {{ item.tipo === 'Venda' ? '📈 Venda' : '📉 Compra' }}
                </span>
              </td>
              <td class="px-4 sm:px-5 py-2.5 font-semibold text-stone-700">{{ item.descricao }}</td>
              <td class="px-4 sm:px-5 py-2.5 text-stone-600">{{ formatDateBR(item.data) }}</td>
              <td
                :class="item.tipo === 'Venda' ? 'text-fuchsia-600' : 'text-orange-500'"
                class="px-4 sm:px-5 py-2.5 text-right font-black"
              >
                {{ item.tipo === 'Venda' ? '+' : '-' }}{{ formatCurrency(item.valor) }}
              </td>
            </tr>
          </tbody>
          <tfoot v-if="itensRendimento.length > 0">
            <tr
              :class="rendimento >= 0 ? 'border-emerald-200 bg-emerald-50/60' : 'border-red-200 bg-red-50/60'"
              class="border-t-2"
            >
              <td
                colspan="3"
                :class="rendimento >= 0 ? 'text-emerald-700' : 'text-red-600'"
                class="px-4 sm:px-5 py-3 font-black text-xs uppercase tracking-wide"
              >
                {{ rendimento >= 0 ? 'Lucro' : 'Prejuízo' }}
              </td>
              <td
                :class="rendimento >= 0 ? 'text-emerald-600' : 'text-red-500'"
                class="px-4 sm:px-5 py-3 text-right font-black"
              >
                {{ formatCurrency(rendimento) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRelatorioFormatar } from '~/composables/relatorios/useRelatorioFormatar'

defineProps<{
  itensRendimento: { tipo: string; descricao: string; data: string; valor: number }[]
  totalVendas: number
  totalCompras: number
  rendimento: number
}>()

defineEmits<{
  exportarExcel: []
  exportarPDF: []
}>()

const { formatCurrency, formatDateBR } = useRelatorioFormatar()
</script>