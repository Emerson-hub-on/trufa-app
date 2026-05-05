import { defineStore } from 'pinia'

export interface Venda {
  id: string
  data: string
  produto: string
  quantidade: number
  valorUnit: number
}

export const useVendasStore = defineStore('vendas', {
  state: () => ({
    vendas: [] as Venda[],
  }),

  getters: {
    totalVendas: (state) =>
      state.vendas.reduce((acc, v) => acc + v.quantidade * v.valorUnit, 0),
    totalUnidades: (state) =>
      state.vendas.reduce((acc, v) => acc + v.quantidade, 0),
    maisVendida: (state): { produto: string; vendas: number } | null => {
      const map: Record<string, number> = {}
      state.vendas.forEach(v => { map[v.produto] = (map[v.produto] || 0) + v.quantidade })
      const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0]
      return top ? { produto: top[0], vendas: top[1] } : null
    },
    vendasPorSabor: (state) => (sabor: string) =>
      state.vendas.filter(v => v.produto === sabor),
    totalPorSabor: (state) => (sabor: string) =>
      state.vendas
        .filter(v => v.produto === sabor)
        .reduce((acc, v) => acc + v.quantidade * v.valorUnit, 0),
    unidadesPorSabor: (state) => (sabor: string) =>
      state.vendas
        .filter(v => v.produto === sabor)
        .reduce((acc, v) => acc + v.quantidade, 0),
  },

  actions: {
    setVendas(raw: any[]) {
      this.vendas = raw.map(v => ({
        id: v.id,
        data: v.data,
        produto: v.produto,
        quantidade: v.quantidade,
        valorUnit: v.valor_unit,
      }))
    },

    async adicionarVenda(venda: Omit<Venda, 'id'>) {
      const supabase = useSupabaseClient() as any
      const session = useSupabaseSession() as any
      const userId = session.value?.user?.id
      if (!userId) return

      const { data, error } = await supabase.from('vendas').insert({
        user_id: userId,
        data: venda.data,
        produto: venda.produto,
        quantidade: venda.quantidade,
        valor_unit: venda.valorUnit,
      }).select().single()

      if (error) { console.error('Erro ao salvar venda:', error); return }
      if (data) this.vendas.unshift({ ...venda, id: data.id })
    },

    async removerVenda(id: string) {
      const supabase = useSupabaseClient()
      await supabase.from('vendas').delete().eq('id', id)
      this.vendas = this.vendas.filter(v => v.id !== id)
    },
  },
})