<template>
  <div class="flex flex-col gap-4">
    <div class="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm shadow-pink-100">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <h2 class="font-black text-rose-700 text-sm uppercase tracking-wide">📦 Compras / Insumos</h2>
        <button @click="showModal = true" class="text-xs font-bold bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-full transition-colors shadow-sm">
          + Nova
        </button>
      </div>

      <!-- Filtro período -->
      <div class="px-5 py-3 flex flex-wrap items-center gap-2 border-b border-pink-50">
        <button
          v-for="p in periodos" :key="p.label"
          @click="selecionarPeriodo(p)"
          class="px-3 py-1.5 rounded-full border text-xs font-bold transition-all"
          :class="periodoAtivo === p.label ? 'bg-orange-400 border-orange-400 text-white' : 'bg-white border-pink-200 text-stone-600 hover:border-orange-300'"
        >
          {{ p.label }}
        </button>
        <div class="flex items-center gap-2 ml-auto flex-wrap">
          <input v-model="dataInicio" type="date" @change="periodoAtivo = 'Custom'"
            class="border border-pink-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300" />
          <span class="text-xs text-stone-400">até</span>
          <input v-model="dataFim" type="date" @change="periodoAtivo = 'Custom'"
            class="border border-pink-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300" />
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 divide-x divide-pink-50 border-b border-pink-100">
        <div class="px-5 py-3">
          <p class="text-xs font-bold uppercase tracking-widest text-stone-300">Total gasto</p>
          <p class="text-lg font-black text-orange-400">{{ formatCurrency(totalFiltrado) }}</p>
        </div>
        <div class="px-5 py-3">
          <p class="text-xs font-bold uppercase tracking-widest text-stone-300">Registros</p>
          <p class="text-lg font-black text-stone-700">{{ comprasFiltradas.length }}</p>
        </div>
      </div>

      <!-- Tabela desktop -->
      <div class="hidden md:block overflow-x-auto">
        <div v-if="comprasFiltradas.length === 0" class="px-5 py-10 text-center text-stone-400 text-sm">
          Nenhuma compra no período selecionado.
        </div>
        <table v-else class="w-full text-sm">
          <thead>
            <tr class="text-xs font-bold uppercase tracking-widest text-stone-400 border-b border-pink-50">
              <th class="text-left px-5 py-3">Data</th>
              <th class="text-left px-5 py-3">Item</th>
              <th class="text-left px-5 py-3">Quantidade</th>
              <th class="text-left px-5 py-3">Custo</th>
              <th></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-pink-50">
            <tr v-for="c in comprasFiltradas" :key="c.id" class="hover:bg-rose-50/50 transition-colors">
              <td class="px-5 py-3 text-stone-500 text-xs">{{ c.data }}</td>
              <td class="px-5 py-3 font-bold text-stone-700">{{ c.item }}</td>
              <td class="px-5 py-3 text-stone-700">{{ c.quantidade }}</td>
              <td class="px-5 py-3 font-black text-orange-400">{{ formatCurrency(c.custo) }}</td>
              <td class="px-3 py-3">
                <button @click="store.removerCompra(c.id)" class="text-stone-300 hover:text-rose-400 transition-colors font-bold">✕</button>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="comprasFiltradas.length > 0">
            <tr class="border-t-2 border-pink-100 bg-rose-50/50">
              <td colspan="3" class="px-5 py-3 text-xs font-bold uppercase tracking-widest text-stone-400">Total</td>
              <td class="px-5 py-3 font-black text-orange-400">{{ formatCurrency(totalFiltrado) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Cards mobile -->
      <div class="md:hidden flex flex-col gap-3 p-3">
        <div v-if="comprasFiltradas.length === 0" class="text-center text-sm text-stone-400 py-6">
          Nenhuma compra no período selecionado.
        </div>
        <div v-for="c in comprasFiltradas" :key="c.id" class="bg-white border border-pink-100 rounded-2xl p-4 shadow-sm">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-bold text-stone-800">{{ c.item }}</p>
              <p class="text-xs text-stone-400">{{ c.data }}</p>
            </div>
            <button @click="store.removerCompra(c.id)" class="text-xs text-rose-400 font-bold">✕</button>
          </div>
          <div class="flex justify-between text-xs text-stone-600 mt-2">
            <span>{{ c.quantidade }}</span>
            <span class="font-black text-orange-400">{{ formatCurrency(c.custo) }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-rose-950/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showModal = false">
        <div class="bg-white rounded-3xl shadow-2xl shadow-pink-200 w-full max-w-md">
          <div class="flex items-center justify-between px-6 py-5 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-3xl">
            <h3 class="font-black text-rose-700">Nova Compra</h3>
            <button @click="showModal = false" class="text-rose-300 hover:text-rose-500 text-xl font-bold">×</button>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Data</label>
              <input v-model="form.data" type="date" class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Item / Ingrediente</label>
              <input v-model="form.item" type="text" placeholder="ex: Chocolate" class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Quantidade</label>
                <input v-model="form.quantidade" type="text" placeholder="ex: 1kg" class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Custo (R$)</label>
                <input v-model.number="form.custo" type="number" step="0.01" min="0" placeholder="0,00" class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-pink-100">
            <button @click="showModal = false" class="text-sm font-bold text-stone-500 hover:text-stone-700 px-4 py-2">Cancelar</button>
            <button @click="salvar" class="text-sm font-bold bg-rose-400 hover:bg-rose-500 text-white px-5 py-2 rounded-full transition-colors shadow-sm">Salvar</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useTrufaStore } from '~/stores/trufa'
import { usePeriodoFiltro } from '~/composables/compras/usePeriodoFiltro'
import { useComprasForm } from '~/composables/compras/useComprasForm'


definePageMeta({ layout: 'default' })

const store = useTrufaStore()

const { showModal, form, salvar } = useComprasForm()
const { periodoAtivo, dataInicio, dataFim, periodos, selecionarPeriodo, itensFiltrados: comprasFiltradas } =
  usePeriodoFiltro(computed(() => store.compras))

const totalFiltrado = computed(() =>
  comprasFiltradas.value.reduce((acc, c) => acc + c.custo, 0)
)

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>