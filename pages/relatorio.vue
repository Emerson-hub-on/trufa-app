<!-- pages/relatorio.vue -->
<template>
  <div class="flex flex-col gap-4 sm:gap-5">

    <!-- Filtros -->
    <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
      <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">🔍 Filtros</h2>
      </div>

      <div class="p-4 sm:p-5 flex flex-col gap-3">
        <!-- Período rápido -->
        <div class="flex flex-wrap gap-2">
          <button v-for="p in periodos" :key="p.label" @click="aplicarPeriodo(p)"
            :class="periodoAtivo === p.label ? 'bg-rose-400 text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'"
            class="text-xs font-bold px-3 py-1.5 rounded-full transition-colors">
            {{ p.label }}
          </button>
        </div>

        <!-- Datas customizadas -->
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div class="flex items-center gap-2 flex-1 w-full">
            <label class="text-xs font-bold text-stone-500 whitespace-nowrap">De</label>
            <input v-model="filtro.de" type="date"
              class="border border-pink-200 rounded-xl px-3 py-2 text-xs sm:text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
          <div class="flex items-center gap-2 flex-1 w-full">
            <label class="text-xs font-bold text-stone-500 whitespace-nowrap">Até</label>
            <input v-model="filtro.ate" type="date"
              class="border border-pink-200 rounded-xl px-3 py-2 text-xs sm:text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <label class="text-xs font-bold text-stone-500 whitespace-nowrap">Sabor</label>
            <select v-model="filtro.sabor"
              class="border border-pink-200 rounded-xl px-3 py-2 text-xs sm:text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300">
              <option value="">Todos</option>
              <option v-for="s in store.sabores" :key="s.id" :value="s.nome">{{ s.nome }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumo -->
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

    <!-- Tabela + exportação -->
    <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
      <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between gap-2 flex-wrap">
        <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">📋 Vendas</h2>
        <div class="flex gap-2">
          <button @click="exportarExcel"
            class="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
            <span>📊</span> Excel
          </button>
          <button @click="exportarPDF"
            class="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
            <span>📄</span> PDF
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm" id="tabela-relatorio">
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
              <td colspan="5" class="text-center py-10 text-stone-400 text-xs">Nenhuma venda no período selecionado.</td>
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
              <td colspan="4" class="px-4 sm:px-5 py-3 font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">Total</td>
              <td class="px-4 sm:px-5 py-3 text-right font-black text-rose-600 text-sm sm:text-base">{{ formatCurrency(totalVendas) }}</td>
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
              <div class="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500"
                :style="{ width: `${s.percentual}%` }" />
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
import { useTrufaStore } from '~/stores/trufa'

definePageMeta({ layout: 'default' })

const store = useTrufaStore()

// ── Filtros ─────────────────────────────────────────────────
const hoje = new Date()
const fmt = (d: Date): string => d.toISOString().split('T')[0] ?? ''
const filtro = reactive<{ de: string; ate: string; sabor: string }>({
  de: fmt(new Date(hoje.getFullYear(), hoje.getMonth(), 1)),
  ate: fmt(hoje),
  sabor: '',
})

const periodoAtivo = ref('Este mês')

const periodos = [
  {
    label: 'Hoje',
    de: () => fmt(hoje),
    ate: () => fmt(hoje),
  },
  {
    label: 'Esta semana',
    de: () => {
      const d = new Date(hoje)
      d.setDate(hoje.getDate() - hoje.getDay())
      return fmt(d)
    },
    ate: () => fmt(hoje),
  },
  {
    label: 'Este mês',
    de: () => fmt(new Date(hoje.getFullYear(), hoje.getMonth(), 1)),
    ate: () => fmt(hoje),
  },
  {
    label: 'Mês anterior',
    de: () => fmt(new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)),
    ate: () => fmt(new Date(hoje.getFullYear(), hoje.getMonth(), 0)),
  },
  {
    label: 'Tudo',
    de: () => '2000-01-01',
    ate: () => fmt(hoje),
  },
]

function aplicarPeriodo(p: typeof periodos[0]) {
  filtro.de = p.de()
  filtro.ate = p.ate()
  periodoAtivo.value = p.label
}

// ── Dados filtrados ─────────────────────────────────────────
const vendasFiltradas = computed(() => {
  return store.vendas.filter(v => {
    const dentroData = v.data >= filtro.de && v.data <= filtro.ate
    const dentroSabor = !filtro.sabor || v.produto === filtro.sabor
    return dentroData && dentroSabor
  })
})

const totalVendas = computed(() =>
  vendasFiltradas.value.reduce((acc, v) => acc + v.quantidade * v.valorUnit, 0)
)

const totalUnidades = computed(() =>
  vendasFiltradas.value.reduce((acc, v) => acc + v.quantidade, 0)
)

const ticketMedio = computed(() =>
  vendasFiltradas.value.length > 0 ? totalVendas.value / vendasFiltradas.value.length : 0
)

const porSabor = computed(() => {
  const map: Record<string, { total: number; unidades: number }> = {}
  vendasFiltradas.value.forEach(v => {
    if (!map[v.produto]) map[v.produto] = { total: 0, unidades: 0 }
    map[v.produto]!.total += v.quantidade * v.valorUnit
    map[v.produto]!.unidades += v.quantidade
  })
  const total = totalVendas.value || 1
  return Object.entries(map)
    .map(([nome, d]) => ({ nome, ...d, percentual: (d.total / total) * 100 }))
    .sort((a, b) => b.total - a.total)
})

// ── Formatação ──────────────────────────────────────────────
function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDateBR(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

// ── Exportar Excel ──────────────────────────────────────────
async function exportarExcel() {
  const XLSX = await import('xlsx')

  const dados = vendasFiltradas.value.map(v => ({
    Data: formatDateBR(v.data),
    Produto: v.produto,
    Quantidade: v.quantidade,
    'Valor Unit. (R$)': v.valorUnit,
    'Total (R$)': v.quantidade * v.valorUnit,
  }))

  // Linha de total
  dados.push({
    Data: '',
    Produto: 'TOTAL',
    Quantidade: totalUnidades.value,
    'Valor Unit. (R$)': 0,
    'Total (R$)': totalVendas.value,
  })

  const ws = XLSX.utils.json_to_sheet(dados)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Vendas')
  XLSX.writeFile(wb, `relatorio-vendas-${filtro.de}-${filtro.ate}.xlsx`)
}

// ── Exportar PDF ────────────────────────────────────────────
async function exportarPDF() {
  const { default: jsPDF } = await import('jspdf' as any)
  const { default: autoTable } = await import('jspdf-autotable' as any)

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Cabeçalho
  doc.setFillColor(251, 113, 133) // rose-400
  doc.rect(0, 0, 210, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('🍫 Trufa Manager — Relatório de Vendas', 14, 12)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Período: ${formatDateBR(filtro.de)} até ${formatDateBR(filtro.ate)}${filtro.sabor ? ' · Sabor: ' + filtro.sabor : ''}`, 14, 21)

  // Resumo
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total: ${formatCurrency(totalVendas.value)}   Unidades: ${totalUnidades.value}   Registros: ${vendasFiltradas.value.length}   Ticket médio: ${formatCurrency(ticketMedio.value)}`, 14, 35)

  // Tabela de vendas
  autoTable(doc, {
    startY: 40,
    head: [['Data', 'Produto', 'Qtd', 'Unit.', 'Total']],
    body: [
      ...vendasFiltradas.value.map(v => [
        formatDateBR(v.data),
        v.produto,
        v.quantidade,
        formatCurrency(v.valorUnit),
        formatCurrency(v.quantidade * v.valorUnit),
      ]),
      ['', 'TOTAL', totalUnidades.value, '', formatCurrency(totalVendas.value)],
    ],
    headStyles: { fillColor: [251, 113, 133], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    footStyles: { fillColor: [255, 241, 242], textColor: [190, 18, 60], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 247, 248] },
    columnStyles: {
      0: { cellWidth: 22 },
      2: { halign: 'right', cellWidth: 14 },
      3: { halign: 'right', cellWidth: 26 },
      4: { halign: 'right', cellWidth: 28 },
    },
  })

  // Por sabor
  const finalY = (doc as any).lastAutoTable.finalY + 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(190, 18, 60)
  doc.text('Por Sabor', 14, finalY)

  autoTable(doc, {
    startY: finalY + 4,
    head: [['Sabor', 'Unidades', 'Total', '%']],
    body: porSabor.value.map(s => [
      s.nome,
      s.unidades,
      formatCurrency(s.total),
      `${s.percentual.toFixed(1)}%`,
    ]),
    headStyles: { fillColor: [251, 113, 133], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [255, 247, 248] },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    },
  })

  doc.save(`relatorio-vendas-${filtro.de}-${filtro.ate}.pdf`)
}
</script>