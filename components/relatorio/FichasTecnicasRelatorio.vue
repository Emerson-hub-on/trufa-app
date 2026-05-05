<template>
  <div class="flex flex-col gap-4 sm:gap-5">

    <div
      v-for="f in fichasTecnicas" :key="f.id"
      class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm"
    >
      <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between">
        <div>
          <h2 class="font-black text-rose-700 text-xs sm:text-sm">🧾 {{ f.nome }}</h2>
          <p class="text-[10px] text-stone-400 mt-0.5">Produção: {{ f.producao }} unidades</p>
        </div>
        <div>
          <p class="text-xs font-black text-rose-500">
            Custo total: {{ formatCurrency(f.ingredientes.reduce((a: number, i: any) => a + i.custo, 0)) }}
          </p>
          <p class="text-[10px] text-stone-400 text-right">
            Por unidade: {{ formatCurrency(f.ingredientes.reduce((a: number, i: any) => a + i.custo, 0) / (f.producao || 1)) }}
          </p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm">
          <thead>
            <tr class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-500 border-b border-pink-50 bg-rose-50/40">
              <th class="text-left px-4 sm:px-5 py-3">Ingrediente</th>
              <th class="text-left px-4 sm:px-5 py-3">Quantidade</th>
              <th class="text-right px-4 sm:px-5 py-3">Custo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-pink-50">
            <tr v-for="ing in f.ingredientes" :key="ing.nome" class="hover:bg-rose-50/40 transition-colors">
              <td class="px-4 sm:px-5 py-2.5 font-semibold text-stone-700">{{ ing.nome }}</td>
              <td class="px-4 sm:px-5 py-2.5 text-stone-600">{{ ing.quantidade }}</td>
              <td class="px-4 sm:px-5 py-2.5 text-right font-black text-rose-500">{{ formatCurrency(ing.custo) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-t-2 border-rose-200 bg-rose-50/60">
              <td colspan="2" class="px-4 sm:px-5 py-3 font-black text-rose-700 text-xs uppercase tracking-wide">Total</td>
              <td class="px-4 sm:px-5 py-3 text-right font-black text-rose-600">
                {{ formatCurrency(f.ingredientes.reduce((a: number, i: any) => a + i.custo, 0)) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div
      v-if="fichasTecnicas.length === 0"
      class="bg-white border border-pink-100 rounded-2xl p-10 text-center text-stone-400 text-xs shadow-sm"
    >
      Nenhuma ficha técnica cadastrada.
    </div>

    <!-- Botões de exportar -->
    <div class="flex justify-end gap-2">
      <button @click="$emit('exportarExcel')" class="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm">
        📊 Excel
      </button>
      <button @click="$emit('exportarPDF')" class="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm">
        📄 PDF
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRelatorioFormatar } from '~/composables/relatorios/useRelatorioFormatar'

defineProps<{
  fichasTecnicas: {
    id: string
    nome: string
    producao: number
    ingredientes: { nome: string; quantidade: string; custo: number }[]
  }[]
}>()

defineEmits<{
  exportarExcel: []
  exportarPDF: []
}>()

const { formatCurrency } = useRelatorioFormatar()
</script>