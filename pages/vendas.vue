<template>
  <div class="flex flex-col gap-4">
    <div class="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm shadow-pink-100">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <h2 class="font-black text-rose-700 text-sm uppercase tracking-wide">💸 Vendas</h2>
        <button
          @click="abrirModal"
          :disabled="store.sabores.length === 0"
          class="text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm"
          :class="store.sabores.length > 0 ? 'bg-rose-400 hover:bg-rose-500 text-white' : 'bg-stone-100 text-stone-400 cursor-not-allowed'"
        >
          + Nova venda
        </button>
      </div>

      <div v-if="store.sabores.length === 0" class="px-5 py-10 text-center text-stone-400 text-sm">
        <p class="text-xl mb-2">🍫</p>
        <p class="font-bold text-stone-500 mb-1">Nenhum sabor cadastrado</p>
        <p class="text-xs mb-4">Cadastre sabores antes de registrar vendas.</p>
        <NuxtLink to="/sabores" class="text-xs font-bold bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-full transition-colors">
          Ir para Sabores
        </NuxtLink>
      </div>

      <template v-else>

        <!-- Filtro sabor -->
        <div class="px-5 pt-3 pb-3 flex items-center gap-3 border-b border-pink-50">
          <button
            class="px-4 py-1.5 rounded-full border text-xs font-bold transition-all flex-shrink-0"
            :class="saborFiltro === null ? 'bg-rose-400 border-rose-400 text-white' : 'bg-white border-pink-200 text-stone-600 hover:border-rose-300'"
            @click="saborFiltro = null; dropdownOpen = false"
          >
            Todos
          </button>
          <div class="relative" ref="dropdownRef">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-bold transition-all"
              :class="saborFiltro !== null ? 'bg-rose-400 border-rose-400 text-white' : 'bg-white border-pink-200 text-stone-600 hover:border-rose-300'"
            >
              🍫 {{ saborFiltro ?? 'Sabores' }}
              <span class="text-[10px]">{{ dropdownOpen ? '▲' : '▼' }}</span>
            </button>
            <div v-if="dropdownOpen" class="absolute top-full left-0 mt-2 bg-white border border-pink-100 rounded-2xl shadow-lg z-20 min-w-48 overflow-hidden">
              <button
                v-for="s in store.sabores" :key="s.id"
                @click="saborFiltro = s.nome; dropdownOpen = false"
                class="w-full text-left px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center justify-between gap-3"
                :class="saborFiltro === s.nome ? 'bg-rose-50 text-rose-700' : ''"
              >
                {{ s.nome }}
                <span v-if="saborFiltro === s.nome" class="text-rose-400">✓</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Filtro período -->
        <div class="px-5 py-3 flex flex-wrap items-center gap-2 border-b border-pink-50">
          <button
            v-for="p in periodos" :key="p.label"
            @click="selecionarPeriodo(p)"
            class="px-3 py-1.5 rounded-full border text-xs font-bold transition-all"
            :class="periodoAtivo === p.label ? 'bg-fuchsia-400 border-fuchsia-400 text-white' : 'bg-white border-pink-200 text-stone-600 hover:border-fuchsia-300'"
          >
            {{ p.label }}
          </button>
          <div class="flex items-center gap-2 ml-auto flex-wrap">
            <input v-model="dataInicio" type="date" @change="periodoAtivo = 'Custom'"
              class="border border-pink-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-fuchsia-300" />
            <span class="text-xs text-stone-400">até</span>
            <input v-model="dataFim" type="date" @change="periodoAtivo = 'Custom'"
              class="border border-pink-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-fuchsia-300" />
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 divide-x divide-pink-50 border-b border-pink-100">
          <div class="px-5 py-3">
            <p class="text-xs font-bold uppercase tracking-widest text-stone-300">Total</p>
            <p class="text-lg font-black text-fuchsia-500">{{ formatCurrency(totalFiltrado) }}</p>
          </div>
          <div class="px-5 py-3">
            <p class="text-xs font-bold uppercase tracking-widest text-stone-300">Registros</p>
            <p class="text-lg font-black text-stone-700">{{ vendasFiltradas.length }}</p>
          </div>
          <div class="px-5 py-3">
            <p class="text-xs font-bold uppercase tracking-widest text-stone-300">Unidades</p>
            <p class="text-lg font-black text-stone-700">{{ unidadesFiltradas }}</p>
          </div>
        </div>

        <!-- Tabela desktop -->
        <div class="hidden md:block overflow-x-auto">
          <div v-if="vendasFiltradas.length === 0" class="px-5 py-10 text-center text-stone-400 text-sm">
            Nenhuma venda no período selecionado.
          </div>
          <table v-else class="w-full text-sm">
            <thead>
              <tr class="text-xs font-bold uppercase tracking-widest text-stone-400 border-b border-pink-50">
                <th class="text-left px-5 py-3">Data</th>
                <th class="text-left px-5 py-3">Produto</th>
                <th class="text-left px-5 py-3">Qtd</th>
                <th class="text-left px-5 py-3">Valor unit.</th>
                <th class="text-left px-5 py-3">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in vendasFiltradas" :key="v.id" class="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                <td class="px-5 py-3 text-xs text-stone-500">{{ v.data }}</td>
                <td class="px-5 py-3 font-bold">{{ v.produto }}</td>
                <td class="px-5 py-3">{{ v.quantidade }}</td>
                <td class="px-5 py-3">{{ formatCurrency(v.valorUnit) }}</td>
                <td class="px-5 py-3 font-black text-rose-500">{{ formatCurrency(v.quantidade * v.valorUnit) }}</td>
                <td class="px-3 py-3">
                  <button @click="store.removerVenda(v.id)" class="text-stone-300 hover:text-rose-400 transition-colors font-bold">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cards mobile -->
        <div class="md:hidden flex flex-col gap-3 p-3">
          <div v-if="vendasFiltradas.length === 0" class="text-center text-sm text-stone-400 py-6">
            Nenhuma venda no período selecionado.
          </div>
          <div v-for="v in vendasFiltradas" :key="v.id" class="bg-white border border-pink-100 rounded-2xl p-4 shadow-sm">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="font-bold text-stone-800">{{ v.produto }}</p>
                <p class="text-xs text-stone-400">{{ v.data }}</p>
              </div>
              <button @click="store.removerVenda(v.id)" class="text-xs text-rose-400 font-bold">✕</button>
            </div>
            <div class="flex justify-between text-xs text-stone-600 mt-3">
              <span>Qtd: {{ v.quantidade }}</span>
              <span>{{ formatCurrency(v.valorUnit) }}</span>
            </div>
            <div class="mt-2 text-right">
              <p class="text-sm font-black text-rose-500">{{ formatCurrency(v.quantidade * v.valorUnit) }}</p>
            </div>
          </div>
        </div>

      </template>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-rose-950/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showModal = false">
        <div class="bg-white rounded-3xl shadow-2xl shadow-pink-200 w-full max-w-md">
          <div class="flex items-center justify-between px-6 py-5 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-3xl">
            <h3 class="font-black text-rose-700">Nova Venda</h3>
            <button @click="showModal = false" class="text-rose-300 hover:text-rose-500 text-xl font-bold">×</button>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Data *</label>
              <input v-model="form.data" type="date" class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Sabor *</label>
              <select v-model="form.produto" @change="preencherPreco" class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white">
                <option value="" disabled>Selecione um sabor</option>
                <option v-for="s in store.sabores" :key="s.id" :value="s.nome">{{ s.nome }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Quantidade *</label>
                <input v-model.number="form.quantidade" type="number" min="1" placeholder="0" class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Valor unit. (R$) *</label>
                <input v-model.number="form.valorUnit" type="number" step="0.01" min="0" placeholder="0,00" class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
            </div>
            <div v-if="form.quantidade && form.valorUnit" class="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-sm text-rose-700">
              Total: <strong>{{ formatCurrency(form.quantidade * form.valorUnit) }}</strong>
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
import { useSaborFiltroDropdown } from '~/composables/vendas/useSaborFiltroDropdown'
import { useVendasFiltradas } from '~/composables/vendas/useVendasFiltradas'
import { useVendaModal } from '~/composables/vendas/useVendaModal'

definePageMeta({ layout: 'default' })

const store = useTrufaStore()

const { saborFiltro, dropdownOpen, dropdownRef } = useSaborFiltroDropdown()
const { periodoAtivo, dataInicio, dataFim, periodos, selecionarPeriodo, vendasFiltradas, totalFiltrado, unidadesFiltradas } = useVendasFiltradas(saborFiltro)
const { showModal, form, abrirModal, preencherPreco, salvar } = useVendaModal(saborFiltro)

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>