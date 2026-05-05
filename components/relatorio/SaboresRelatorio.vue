<template>
  <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
    <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between gap-2 flex-wrap">
      <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">🍫 Sabores</h2>
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
            <th class="text-left px-4 sm:px-5 py-3">Nome</th>
            <th class="text-left px-4 sm:px-5 py-3">Descrição</th>
            <th class="text-right px-4 sm:px-5 py-3">Preço</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-pink-50">
          <tr v-if="sabores.length === 0">
            <td colspan="3" class="text-center py-10 text-stone-400 text-xs">Nenhum sabor cadastrado.</td>
          </tr>
          <tr v-for="s in sabores" :key="s.id" class="hover:bg-rose-50/40 transition-colors">
            <td class="px-4 sm:px-5 py-2.5 font-semibold text-stone-700">{{ s.nome }}</td>
            <td class="px-4 sm:px-5 py-2.5 text-stone-500">{{ s.descricao || '—' }}</td>
            <td class="px-4 sm:px-5 py-2.5 text-right font-black text-rose-500">{{ formatCurrency(s.preco) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRelatorioFormatar } from '~/composables/relatorios/useRelatorioFormatar'

defineProps<{
  sabores: { id: string; nome: string; descricao?: string; preco: number }[]
}>()

defineEmits<{
  exportarExcel: []
  exportarPDF: []
}>()

const { formatCurrency } = useRelatorioFormatar()
</script>