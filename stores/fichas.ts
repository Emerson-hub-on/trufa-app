import { defineStore } from 'pinia'

export interface Ingrediente {
  nome: string
  quantidade: string
  custo: number
}

export interface FichaTecnica {
  id: string
  nome: string
  producao: number
  ingredientes: Ingrediente[]
}

export const useFichasStore = defineStore('fichas', {
  state: () => ({
    fichasTecnicas: [] as FichaTecnica[],
  }),

  actions: {
    setFichas(raw: any[]) {
      this.fichasTecnicas = raw.map(f => ({
        id: f.id,
        nome: f.nome,
        producao: f.producao,
        ingredientes: (f.ingredientes ?? []).map((i: any) => ({
          nome: i.nome,
          quantidade: i.quantidade,
          custo: i.custo,
        })),
      }))
    },

    async adicionarFicha(ficha: Omit<FichaTecnica, 'id'>, userId?: string) {
      const supabase = useSupabaseClient() as any
      const user = useSupabaseUser()
      const id = userId || user.value?.id
      if (!id) { console.error('Sem userId para adicionarFicha'); return }

      const { data, error } = await supabase.from('fichas_tecnicas').insert({
        user_id: id,
        nome: ficha.nome,
        producao: ficha.producao,
      }).select().single()

      if (!error && data) {
        if (ficha.ingredientes.length > 0) {
          await supabase.from('ingredientes').insert(
            ficha.ingredientes.map((i: Ingrediente) => ({ ficha_id: data.id, ...i }))
          )
        }
        this.fichasTecnicas.push({ ...ficha, id: data.id })
      } else {
        console.error('Erro ao salvar ficha:', error)
      }
    },

    async removerFicha(id: string) {
      const supabase = useSupabaseClient()
      await supabase.from('fichas_tecnicas').delete().eq('id', id)
      this.fichasTecnicas = this.fichasTecnicas.filter(f => f.id !== id)
    },
  },
})