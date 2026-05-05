<template>
  <div class="flex flex-col gap-4 sm:gap-5">

    <!-- Cards de stats -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-200 rounded-2xl p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">💸 Total Gasto</p>
        <p class="text-base sm:text-xl font-black text-orange-500">{{ formatCurrency(totalCompras) }}</p>
      </div>
      <div class="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-3 sm:p-4">
        <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-rose-400 mb-1">🧾 Registros</p>
        <p class="text-base sm:text-xl font-black text-rose-600">{{ comprasFiltradas.length }}</p>
      </div>
    </div>

    <!-- Tabela de compras -->
    <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
      <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between gap-2 flex-wrap">
        <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">📦 Compras</h2>
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
              <th class="text-left px-4 sm:px-5 py-3">Item</th>
              <th class="text-left px-4 sm:px-5 py-3">Qtd</th>
              <th class="text-right px-4 sm:px-5 py-3">Custo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-pink-50">
            <tr v-if="comprasFiltradas.length === 0">
              <td colspan="4" class="text-center py-10 text-stone-400 text-xs">Nenhuma compra no período.</td>
            </tr>
            <tr v-for="c in comprasFiltradas" :key="c.id" class="hover:bg-rose-50/40 transition-colors">
              <td class="px-4 sm:px-5 py-2.5 text-stone-600">{{ formatDateBR(c.data) }}</td>
              <td class="px-4 sm:px-5 py-2.5 font-semibold text-stone-700">{{ c.item }}</td>
              <td class="px-4 sm:px-5 py-2.5 text-stone-600">{{ c.quantidade }}</td>
              <td class="px-4 sm:px-5 py-2.5 text-right font-black text-orange-500">{{ formatCurrency(c.custo) }}</td>
            </tr>
          </tbody>
          <tfoot v-if="comprasFiltradas.length > 0">
            <tr class="border-t-2 border-orange-200 bg-orange-50/60">
              <td colspan="2" class="px-4 sm:px-5 py-3 font-black text-orange-700 text-xs uppercase tracking-wide">Total</td>
              <td class="px-4 sm:px-5 py-3 font-black text-orange-700">{{ comprasFiltradas.length }} itens</td>
              <td class="px-4 sm:px-5 py-3 text-right font-black text-orange-600">{{ formatCurrency(totalCompras) }}</td>
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
  comprasFiltradas: any[]
  totalCompras: number
}>()

defineEmits<{
  exportarExcel: []
  exportarPDF: []
}>()

const { formatCurrency, formatDateBR } = useRelatorioFormatar()
</script>