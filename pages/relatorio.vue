<!-- pages/relatorio.vue -->
<template>
  <div class="flex flex-col gap-4 sm:gap-5">

    <!-- Filtros -->
    <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
      <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">🔍 Filtros</h2>
      </div>

      <div class="p-4 sm:p-5 flex flex-col gap-3">

        <!-- Tipo de relatório -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-bold text-stone-500 whitespace-nowrap">Relatório</label>
          <select v-model="tipoRelatorio"
            class="border border-pink-200 rounded-xl px-3 py-2 text-xs sm:text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300 font-semibold text-stone-700">
            <option value="vendas">💸 Vendas</option>
            <option value="compras">📦 Compras</option>
            <option value="rendimento">📈 Rendimento</option>
            <option value="sabores">🍫 Sabores</option>
            <option value="fichas">🧾 Ficha Técnica</option>
          </select>
        </div>

        <!-- Período rápido (não exibe para fichas e sabores) -->
        <template v-if="tipoRelatorio !== 'fichas' && tipoRelatorio !== 'sabores'">
          <div class="flex flex-wrap gap-2">
            <button v-for="p in periodos" :key="p.label" @click="aplicarPeriodo(p)"
              :class="periodoAtivo === p.label ? 'bg-rose-400 text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'"
              class="text-xs font-bold px-3 py-1.5 rounded-full transition-colors">
              {{ p.label }}
            </button>
          </div>

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
            <!-- Filtro sabor só para vendas -->
            <div v-if="tipoRelatorio === 'vendas'" class="flex items-center gap-2 w-full sm:w-auto">
              <label class="text-xs font-bold text-stone-500 whitespace-nowrap">Sabor</label>
              <select v-model="filtro.sabor"
                class="border border-pink-200 rounded-xl px-3 py-2 text-xs sm:text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300">
                <option value="">Todos</option>
                <option v-for="s in store.sabores" :key="s.id" :value="s.nome">{{ s.nome }}</option>
              </select>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- ── VENDAS ───────────────────────────────────────────── -->
    <template v-if="tipoRelatorio === 'vendas'">
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

      <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between gap-2 flex-wrap">
          <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">📋 Vendas</h2>
          <div class="flex gap-2">
            <button @click="exportarExcel('vendas')" class="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
              📊 Excel
            </button>
            <button @click="exportarPDF('vendas')" class="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
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
    </template>

    <!-- ── COMPRAS ──────────────────────────────────────────── -->
    <template v-if="tipoRelatorio === 'compras'">
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

      <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between gap-2 flex-wrap">
          <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">📦 Compras</h2>
          <div class="flex gap-2">
            <button @click="exportarExcel('compras')" class="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
              📊 Excel
            </button>
            <button @click="exportarPDF('compras')" class="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
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
    </template>

    <!-- ── RENDIMENTO ───────────────────────────────────────── -->
    <template v-if="tipoRelatorio === 'rendimento'">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-200 rounded-2xl p-3 sm:p-4">
          <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-1">📈 Vendas</p>
          <p class="text-base sm:text-xl font-black text-fuchsia-600">{{ formatCurrency(totalVendas) }}</p>
        </div>
        <div class="bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-200 rounded-2xl p-3 sm:p-4">
          <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">📉 Compras</p>
          <p class="text-base sm:text-xl font-black text-orange-500">{{ formatCurrency(totalCompras) }}</p>
        </div>
        <div :class="rendimento >= 0 ? 'from-emerald-50 to-teal-50 border-emerald-200' : 'from-red-50 to-rose-50 border-red-200'"
          class="col-span-2 sm:col-span-1 bg-gradient-to-br rounded-2xl p-3 sm:p-4 border">
          <p :class="rendimento >= 0 ? 'text-emerald-500' : 'text-red-400'"
            class="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
            {{ rendimento >= 0 ? '💰 Lucro' : '⚠️ Prejuízo' }}
          </p>
          <p :class="rendimento >= 0 ? 'text-emerald-600' : 'text-red-500'"
            class="text-base sm:text-xl font-black">{{ formatCurrency(rendimento) }}</p>
        </div>
      </div>

      <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between gap-2 flex-wrap">
          <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">📈 Rendimento</h2>
          <div class="flex gap-2">
            <button @click="exportarExcel('rendimento')" class="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
              📊 Excel
            </button>
            <button @click="exportarPDF('rendimento')" class="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
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
                  <span :class="item.tipo === 'Venda' ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-orange-100 text-orange-600'"
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {{ item.tipo === 'Venda' ? '📈 Venda' : '📉 Compra' }}
                  </span>
                </td>
                <td class="px-4 sm:px-5 py-2.5 font-semibold text-stone-700">{{ item.descricao }}</td>
                <td class="px-4 sm:px-5 py-2.5 text-stone-600">{{ formatDateBR(item.data) }}</td>
                <td :class="item.tipo === 'Venda' ? 'text-fuchsia-600' : 'text-orange-500'"
                  class="px-4 sm:px-5 py-2.5 text-right font-black">
                  {{ item.tipo === 'Venda' ? '+' : '-' }}{{ formatCurrency(item.valor) }}
                </td>
              </tr>
            </tbody>
            <tfoot v-if="itensRendimento.length > 0">
              <tr :class="rendimento >= 0 ? 'border-emerald-200 bg-emerald-50/60' : 'border-red-200 bg-red-50/60'"
                class="border-t-2">
                <td colspan="3" :class="rendimento >= 0 ? 'text-emerald-700' : 'text-red-600'"
                  class="px-4 sm:px-5 py-3 font-black text-xs uppercase tracking-wide">
                  {{ rendimento >= 0 ? 'Lucro' : 'Prejuízo' }}
                </td>
                <td :class="rendimento >= 0 ? 'text-emerald-600' : 'text-red-500'"
                  class="px-4 sm:px-5 py-3 text-right font-black">{{ formatCurrency(rendimento) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </template>

    <!-- ── SABORES ──────────────────────────────────────────── -->
    <template v-if="tipoRelatorio === 'sabores'">
      <div class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between gap-2 flex-wrap">
          <h2 class="font-black text-rose-700 text-xs sm:text-sm uppercase tracking-wide">🍫 Sabores</h2>
          <div class="flex gap-2">
            <button @click="exportarExcel('sabores')" class="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
              📊 Excel
            </button>
            <button @click="exportarPDF('sabores')" class="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm">
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
              <tr v-if="store.sabores.length === 0">
                <td colspan="3" class="text-center py-10 text-stone-400 text-xs">Nenhum sabor cadastrado.</td>
              </tr>
              <tr v-for="s in store.sabores" :key="s.id" class="hover:bg-rose-50/40 transition-colors">
                <td class="px-4 sm:px-5 py-2.5 font-semibold text-stone-700">{{ s.nome }}</td>
                <td class="px-4 sm:px-5 py-2.5 text-stone-500">{{ s.descricao || '—' }}</td>
                <td class="px-4 sm:px-5 py-2.5 text-right font-black text-rose-500">{{ formatCurrency(s.preco) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- ── FICHAS TÉCNICAS ──────────────────────────────────── -->
    <template v-if="tipoRelatorio === 'fichas'">
      <div v-for="f in store.fichasTecnicas" :key="f.id"
        class="bg-white border border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between">
          <div>
            <h2 class="font-black text-rose-700 text-xs sm:text-sm">🧾 {{ f.nome }}</h2>
            <p class="text-[10px] text-stone-400 mt-0.5">Produção: {{ f.producao }} unidades</p>
          </div>
          <div>
            <p class="text-xs font-black text-rose-500">
              Custo total: {{ formatCurrency(f.ingredientes.reduce((a, i) => a + i.custo, 0)) }}
            </p>
            <p class="text-[10px] text-stone-400 text-right">
              Por unidade: {{ formatCurrency(f.ingredientes.reduce((a, i) => a + i.custo, 0) / (f.producao || 1)) }}
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
                  {{ formatCurrency(f.ingredientes.reduce((a, i) => a + i.custo, 0)) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div v-if="store.fichasTecnicas.length === 0"
        class="bg-white border border-pink-100 rounded-2xl p-10 text-center text-stone-400 text-xs shadow-sm">
        Nenhuma ficha técnica cadastrada.
      </div>

      <!-- Exportar fichas -->
      <div class="flex justify-end gap-2">
        <button @click="exportarExcel('fichas')" class="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm">
          📊 Excel
        </button>
        <button @click="exportarPDF('fichas')" class="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm">
          📄 PDF
        </button>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { useRelatorioExportar } from '~/composables/relatorios/useRelatorioExportar';
import { useRelatorioFiltros } from '~/composables/relatorios/useRelatorioFiltros';
import { useRelatorioFormatar } from '~/composables/relatorios/useRelatorioFormatar';

definePageMeta({ layout: 'default' })

const {
  store, tipoRelatorio, filtro, periodoAtivo, periodos, aplicarPeriodo,
  vendasFiltradas, comprasFiltradas, itensRendimento,
  totalVendas, totalCompras, totalUnidades, ticketMedio, rendimento, porSabor,
} = useRelatorioFiltros()

const { formatCurrency, formatDateBR } = useRelatorioFormatar()
const { exportarExcel, exportarPDF } = useRelatorioExportar()
</script>