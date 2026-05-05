import { defineStore } from 'pinia'

export interface Compra {
  id: string
  data: string
  item: string
  quantidade: string
  custo: number
}

export const useComprasStore = defineStore('compras', {
  state: () => ({
    compras: [] as Compra[],
  }),

  getters: {
    totalCompras: (state) =>
      state.compras.reduce((acc, c) => acc + c.custo, 0),
  },

  actions: {
    setCompras(raw: any[]) {
      this.compras = raw.map(c => ({
        id: c.id,
        data: c.data,
        item: c.item,
        quantidade: c.quantidade,
        custo: c.custo,
      }))
    },

    async adicionarCompra(compra: Omit<Compra, 'id'>) {
      const supabase = useSupabaseClient() as any
      const user = useSupabaseUser()
      const { data, error } = await supabase.from('compras').insert({
        user_id: user.value?.id,
        data: compra.data,
        item: compra.item,
        quantidade: compra.quantidade,
        custo: compra.custo,
      }).select().single()
      if (!error && data) this.compras.unshift({ ...compra, id: data.id })
    },

    async removerCompra(id: string) {
      const supabase = useSupabaseClient()
      await supabase.from('compras').delete().eq('id', id)
      this.compras = this.compras.filter(c => c.id !== id)
    },
  },
})