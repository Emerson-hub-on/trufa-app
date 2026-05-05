<template>
  <div class="flex flex-col gap-4">

    <!-- Header -->
    <div class="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm shadow-pink-100">
      <div class="flex items-center justify-between px-5 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
        <h2 class="font-black text-rose-700 text-sm uppercase tracking-wide">🍫 Sabores Cadastrados</h2>
        <button
          @click="abrirModalNovo"
          class="text-xs font-bold bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-full transition-colors shadow-sm"
        >
          + Novo sabor
        </button>
      </div>

      <!-- Lista vazia -->
      <div v-if="store.sabores.length === 0" class="px-5 py-12 text-center text-stone-400 text-sm">
        <p class="text-2xl mb-2">🍫</p>
        <p class="font-bold text-stone-500 mb-1">Nenhum sabor cadastrado</p>
        <p class="text-xs">Adicione seu primeiro sabor para começar a registrar vendas.</p>
      </div>

      <!-- Grid de sabores -->
      <div v-else class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="s in store.sabores"
          :key="s.id"
          class="border border-pink-100 rounded-2xl p-4 hover:border-rose-200 hover:shadow-sm transition-all group"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1 min-w-0">
              <p class="font-black text-stone-800 text-sm truncate">{{ s.nome }}</p>
              <p v-if="s.descricao" class="text-xs text-stone-400 mt-0.5 truncate">{{ s.descricao }}</p>
            </div>
            <button
              @click="abrirModalEditar(s)"
              class="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-rose-400 hover:text-rose-600 ml-2 shrink-0"
            >
              ✏️
            </button>
          </div>

          <div class="flex items-center justify-between mt-3 pt-3 border-t border-pink-50">
            <span class="text-xs text-stone-400">Preço padrão</span>
            <span class="text-sm font-black text-fuchsia-500">{{ formatCurrency(s.preco) }}</span>
          </div>

          <div class="flex items-center justify-between mt-1">
            <span class="text-xs text-stone-400">Vendas registradas</span>
            <span class="text-xs font-bold text-stone-600">{{ vendasStore.unidadesPorSabor(s.nome) }} un.</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Novo / Editar Sabor -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-rose-950/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-3xl shadow-2xl shadow-pink-200 w-full max-w-md">
          <div class="flex items-center justify-between px-6 py-5 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-3xl">
            <h3 class="font-black text-rose-700">{{ editando ? 'Editar sabor' : 'Novo sabor' }}</h3>
            <button @click="showModal = false" class="text-rose-300 hover:text-rose-500 text-xl font-bold">×</button>
          </div>

          <div class="p-6 flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Nome do sabor *</label>
              <input
                v-model="form.nome"
                type="text"
                placeholder="ex: Trufa de Chocolate"
                class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Preço padrão (R$) *</label>
              <input
                v-model.number="form.preco"
                type="number" step="0.01" min="0" placeholder="0,00"
                class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Descrição (opcional)</label>
              <input
                v-model="form.descricao"
                type="text"
                placeholder="ex: Com cobertura de cacau 70%"
                class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <div v-if="editando" class="pt-1">
              <button
                @click="excluir"
                class="text-xs font-bold text-rose-400 hover:text-rose-600 underline underline-offset-2"
              >
                Excluir este sabor
              </button>
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
import { useSaboresStore } from '~/stores/sabores'
import { useVendasStore } from '~/stores/vendas'
import { useSaborModal } from '~/composables/sabores/useSaborModal'

definePageMeta({ layout: 'default' })

const store = useSaboresStore()
const vendasStore = useVendasStore()

const { showModal, editando, form, abrirModalNovo, abrirModalEditar, salvar, excluir } = useSaborModal()

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>