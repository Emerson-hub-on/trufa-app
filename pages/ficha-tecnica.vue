<template>
  <div class="flex flex-col gap-4">

    <!-- ── Vista: Lista de fichas ─────────────────────────── -->
    <template v-if="!fichaSelecionada">

      <div class="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm shadow-pink-100">
        <div class="flex items-center justify-between px-5 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
          <h2 class="font-black text-rose-700 text-sm uppercase tracking-wide">🧾 Fichas Técnicas</h2>
          <button
            @click="abrirModalNovaFicha"
            :disabled="store.sabores.length === 0"
            class="text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm"
            :class="store.sabores.length > 0
              ? 'bg-rose-400 hover:bg-rose-500 text-white'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'"
          >
            + Nova ficha
          </button>
        </div>

        <!-- Aviso sem sabores -->
        <div v-if="store.sabores.length === 0" class="px-5 py-10 text-center text-stone-400 text-sm">
          <p class="text-xl mb-2">🍫</p>
          <p class="font-bold text-stone-500 mb-1">Cadastre sabores primeiro</p>
          <p class="text-xs mb-4">As fichas técnicas são vinculadas aos sabores cadastrados.</p>
          <NuxtLink to="/sabores" class="text-xs font-bold bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-full transition-colors">
            Ir para Sabores
          </NuxtLink>
        </div>

        <!-- Lista vazia -->
        <div v-else-if="store.fichasTecnicas.length === 0" class="px-5 py-10 text-center text-stone-400 text-sm">
          <p class="text-xl mb-2">🧾</p>
          <p class="font-bold text-stone-500 mb-1">Nenhuma ficha técnica</p>
          <p class="text-xs">Crie fichas para calcular custo por sabor.</p>
        </div>

        <!-- Grid de fichas -->
        <div v-else class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="f in store.fichasTecnicas"
            :key="f.id"
            class="border border-pink-100 rounded-2xl p-4 hover:border-rose-200 hover:shadow-sm transition-all cursor-pointer group"
            @click="fichaSelecionada = f"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 min-w-0">
                <p class="font-black text-stone-800 text-sm truncate">{{ f.nome }}</p>
                <p class="text-xs text-stone-400 mt-0.5">{{ f.ingredientes.length }} ingrediente{{ f.ingredientes.length !== 1 ? 's' : '' }}</p>
              </div>
              <span class="text-lg">🧾</span>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-pink-50">
              <span class="text-xs text-stone-400">Custo total</span>
              <span class="text-sm font-black text-fuchsia-500">{{ formatCurrency(custoTotal(f)) }}</span>
            </div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs text-stone-400">Rendimento</span>
              <span class="text-xs font-bold text-stone-600">{{ f.producao }} un.</span>
            </div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs text-stone-400">Custo/unidade</span>
              <span class="text-xs font-bold text-rose-500">{{ formatCurrency(f.producao > 0 ? custoTotal(f) / f.producao : 0) }}</span>
            </div>

            <!-- Preço de venda do sabor vinculado -->
            <template v-if="precoSabor(f.nome) > 0">
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs text-stone-400">Preço venda</span>
                <span class="text-xs font-bold text-stone-600">{{ formatCurrency(precoSabor(f.nome)) }}</span>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs text-stone-400">Lucro estimado</span>
                <span class="text-xs font-bold text-green-600">
                  {{ formatCurrency(lucroEstimado(f)) }}
                  <span class="text-stone-400">({{ margemLucro(f) }}%)</span>
                </span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- ── Vista: Detalhe da ficha ─────────────────────────── -->
    <template v-else>
      <div class="flex flex-col gap-4">

        <!-- Header da ficha -->
        <div class="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm shadow-pink-100">
          <div class="flex items-center justify-between px-5 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
            <div class="flex items-center gap-3">
              <button @click="fichaSelecionada = null" class="text-xs font-bold text-rose-400 hover:text-rose-600 border border-rose-200 px-3 py-1.5 rounded-full transition-colors">
                ← Voltar
              </button>
              <h2 class="font-black text-rose-700 text-sm">{{ fichaSelecionada.nome }}</h2>
            </div>
            <div class="flex gap-2">
              <button @click="abrirModalEditarFicha(fichaSelecionada)" class="text-xs font-bold border border-rose-300 text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors">
                ✏️ Editar
              </button>
              <button @click="confirmarExcluir(fichaSelecionada)" class="text-xs font-bold border border-stone-200 text-stone-400 hover:border-rose-300 hover:text-rose-400 px-3 py-1.5 rounded-full transition-colors">
                🗑️ Excluir
              </button>
            </div>
          </div>

          <!-- Resumo financeiro -->
          <div class="grid grid-cols-2 sm:grid-cols-4 divide-x divide-pink-50 border-b border-pink-100">
            <div class="px-5 py-3">
              <p class="text-xs font-bold uppercase tracking-widest text-stone-300">Custo total</p>
              <p class="text-lg font-black text-fuchsia-500">{{ formatCurrency(custoTotal(fichaSelecionada)) }}</p>
            </div>
            <div class="px-5 py-3">
              <p class="text-xs font-bold uppercase tracking-widest text-stone-300">Rendimento</p>
              <p class="text-lg font-black text-stone-700">{{ fichaSelecionada.producao }} un.</p>
            </div>
            <div class="px-5 py-3">
              <p class="text-xs font-bold uppercase tracking-widest text-stone-300">Custo/un.</p>
              <p class="text-lg font-black text-rose-500">{{ formatCurrency(fichaSelecionada.producao > 0 ? custoTotal(fichaSelecionada) / fichaSelecionada.producao : 0) }}</p>
            </div>
            <div class="px-5 py-3">
              <p class="text-xs font-bold uppercase tracking-widest text-stone-300">Lucro est.</p>
              <p class="text-lg font-black text-green-600">
                {{ precoSabor(fichaSelecionada.nome) > 0 ? formatCurrency(lucroEstimado(fichaSelecionada)) : '—' }}
              </p>
            </div>
          </div>

          <!-- Preço de venda do sabor -->
          <div v-if="precoSabor(fichaSelecionada.nome) > 0" class="px-5 py-3 border-b border-pink-50 flex items-center justify-between text-sm">
            <span class="text-stone-500">Preço de venda (sabor cadastrado)</span>
            <span class="font-bold text-stone-700">{{ formatCurrency(precoSabor(fichaSelecionada.nome)) }} · margem <span class="text-green-600">{{ margemLucro(fichaSelecionada) }}%</span></span>
          </div>
        </div>

        <!-- Ingredientes -->
        <div class="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm shadow-pink-100">
          <div class="flex items-center justify-between px-5 py-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
            <h3 class="font-black text-rose-700 text-sm uppercase tracking-wide">🥣 Ingredientes</h3>
            <button @click="showModalIngrediente = true" class="text-xs font-bold bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-full transition-colors shadow-sm">
              + Ingrediente
            </button>
          </div>

          <div v-if="fichaSelecionada.ingredientes.length === 0" class="px-5 py-8 text-center text-stone-400 text-sm">
            Nenhum ingrediente ainda. Adicione o primeiro!
          </div>

          <div v-else>
            <!-- Desktop -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-xs font-bold uppercase tracking-widest text-stone-400 border-b border-pink-50">
                    <th class="text-left px-5 py-3">Ingrediente</th>
                    <th class="text-left px-5 py-3">Quantidade</th>
                    <th class="text-left px-5 py-3">Custo</th>
                    <th class="text-left px-5 py-3">% do total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(ing, idx) in fichaSelecionada.ingredientes" :key="idx" class="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td class="px-5 py-3 font-bold">{{ ing.nome }}</td>
                    <td class="px-5 py-3 text-stone-500">{{ ing.quantidade }}</td>
                    <td class="px-5 py-3 font-bold text-fuchsia-500">{{ formatCurrency(ing.custo) }}</td>
                    <td class="px-5 py-3">
                      <div class="flex items-center gap-2">
                        <div class="flex-1 h-1.5 bg-pink-100 rounded-full overflow-hidden">
                          <div class="h-full bg-rose-400 rounded-full" :style="{ width: percIngrediente(fichaSelecionada, ing.custo) + '%' }"></div>
                        </div>
                        <span class="text-xs text-stone-400 w-8 text-right">{{ percIngrediente(fichaSelecionada, ing.custo) }}%</span>
                      </div>
                    </td>
                    <td class="px-3 py-3">
                      <button @click="removerIngrediente(idx)" class="text-stone-300 hover:text-rose-400 transition-colors font-bold">✕</button>
                    </td>
                  </tr>
                  <tr class="bg-rose-50/50">
                    <td class="px-5 py-3 font-black text-stone-700">TOTAL</td>
                    <td class="px-5 py-3"></td>
                    <td class="px-5 py-3 font-black text-fuchsia-600">{{ formatCurrency(custoTotal(fichaSelecionada)) }}</td>
                    <td class="px-5 py-3"></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile -->
            <div class="md:hidden flex flex-col gap-2 p-3">
              <div v-for="(ing, idx) in fichaSelecionada.ingredientes" :key="idx" class="border border-pink-100 rounded-2xl p-3">
                <div class="flex justify-between items-start">
                  <p class="font-bold text-stone-800 text-sm">{{ ing.nome }}</p>
                  <button @click="removerIngrediente(idx)" class="text-xs text-rose-400 font-bold">✕</button>
                </div>
                <div class="flex justify-between text-xs text-stone-500 mt-1">
                  <span>{{ ing.quantidade }}</span>
                  <span class="font-bold text-fuchsia-500">{{ formatCurrency(ing.custo) }}</span>
                </div>
                <div class="mt-2 h-1.5 bg-pink-100 rounded-full overflow-hidden">
                  <div class="h-full bg-rose-400 rounded-full" :style="{ width: percIngrediente(fichaSelecionada, ing.custo) + '%' }"></div>
                </div>
              </div>
              <div class="border-t border-pink-100 px-1 pt-2 flex justify-between text-sm font-black text-stone-700">
                <span>Total</span>
                <span class="text-fuchsia-600">{{ formatCurrency(custoTotal(fichaSelecionada)) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ── Modal: Nova / Editar Ficha ─────────────────────── -->
    <Teleport to="body">
      <div v-if="showModalFicha" class="fixed inset-0 bg-rose-950/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showModalFicha = false">
        <div class="bg-white rounded-3xl shadow-2xl shadow-pink-200 w-full max-w-md">
          <div class="flex items-center justify-between px-6 py-5 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-3xl">
            <h3 class="font-black text-rose-700">{{ editandoFicha ? 'Editar ficha' : 'Nova ficha técnica' }}</h3>
            <button @click="showModalFicha = false" class="text-rose-300 hover:text-rose-500 text-xl font-bold">×</button>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Sabor *</label>
              <select
                v-model="formFicha.nome"
                class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
              >
                <option value="" disabled>Selecione um sabor</option>
                <option v-for="s in store.sabores" :key="s.id" :value="s.nome">{{ s.nome }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Rendimento (unidades) *</label>
              <input
                v-model.number="formFicha.producao"
                type="number" min="1" placeholder="ex: 30"
                class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-pink-100">
            <button @click="showModalFicha = false" class="text-sm font-bold text-stone-500 hover:text-stone-700 px-4 py-2">Cancelar</button>
            <button @click="salvarFicha" class="text-sm font-bold bg-rose-400 hover:bg-rose-500 text-white px-5 py-2 rounded-full transition-colors shadow-sm">Salvar</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Modal: Adicionar Ingrediente ───────────────────── -->
    <Teleport to="body">
      <div v-if="showModalIngrediente" class="fixed inset-0 bg-rose-950/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showModalIngrediente = false">
        <div class="bg-white rounded-3xl shadow-2xl shadow-pink-200 w-full max-w-md">
          <div class="flex items-center justify-between px-6 py-5 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-3xl">
            <h3 class="font-black text-rose-700">Adicionar ingrediente</h3>
            <button @click="showModalIngrediente = false" class="text-rose-300 hover:text-rose-500 text-xl font-bold">×</button>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Nome *</label>
              <input
                v-model="formIngrediente.nome"
                type="text" placeholder="ex: Chocolate ao leite"
                class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Quantidade *</label>
                <input
                  v-model.number="formIngrediente.qtd"
                  type="number" min="0" step="any" placeholder="100"
                  class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Unidade *</label>
                <select
                  v-model="formIngrediente.unidade"
                  class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                  <option value="un">un</option>
                  <option value="colher">colher</option>
                  <option value="xícara">xícara</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold uppercase tracking-widest text-stone-600">Custo (R$) *</label>
              <input
                v-model.number="formIngrediente.custo"
                type="number" step="0.01" min="0" placeholder="0,00"
                class="border border-pink-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-pink-100">
            <button @click="showModalIngrediente = false" class="text-sm font-bold text-stone-500 hover:text-stone-700 px-4 py-2">Cancelar</button>
            <button @click="adicionarIngrediente" class="text-sm font-bold bg-rose-400 hover:bg-rose-500 text-white px-5 py-2 rounded-full transition-colors shadow-sm">Adicionar</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { useTrufaStore } from '~/stores/trufa'
import { useFichaNavegacao } from '~/composables/useFichaNavegacao'
import { useFichaCalculo } from '~/composables/useFichaCalculo'
import { useFichaModal } from '~/composables/useFichaModal'
import { useIngredienteModal } from '~/composables/useIngredienteModal'

definePageMeta({ layout: 'default' })

const store = useTrufaStore()

const { fichaSelecionada } = useFichaNavegacao()
const { custoTotal, precoSabor, lucroEstimado, margemLucro, percIngrediente } = useFichaCalculo()
const { showModalFicha, formFicha, editandoFicha, abrirModalNovaFicha, abrirModalEditarFicha, salvarFicha, confirmarExcluir } = useFichaModal(fichaSelecionada)
const { showModalIngrediente, formIngrediente, adicionarIngrediente, removerIngrediente } = useIngredienteModal(fichaSelecionada)

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>