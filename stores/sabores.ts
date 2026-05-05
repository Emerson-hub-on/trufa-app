import { defineStore } from 'pinia'

export interface Sabor {
  id: string
  nome: string
  preco: number
  descricao: string
}

export const useSaboresStore = defineStore('sabores', {
  state: () => ({
    sabores: [] as Sabor[],
  }),

  actions: {
    setSabores(raw: any[]) {
      this.sabores = raw.map(s => ({
        id: s.id as string,
        nome: s.nome as string,
        preco: s.preco as number,
        descricao: (s.descricao ?? '') as string,
      }))
    },

    async adicionarSabor(sabor: Omit<Sabor, 'id'>) {
      const supabase = useSupabaseClient() as any
      const session = useSupabaseSession() as any
      const userId = session.value?.user?.id
      if (!userId) { console.error('Usuário não autenticado'); return }

      const { data, error } = await supabase.from('sabores').insert({
        user_id: userId,
        nome: sabor.nome,
        preco: sabor.preco,
        descricao: sabor.descricao ?? '',
      }).select().single()

      if (error) { console.error('Erro ao salvar sabor:', error); return }
      if (data) this.sabores.push({ ...sabor, id: data.id })
    },

    async editarSabor(id: string, dados: Partial<Omit<Sabor, 'id'>>) {
      const supabase = useSupabaseClient() as any
      const { error } = await supabase.from('sabores').update({
        nome: dados.nome,
        preco: dados.preco,
        descricao: dados.descricao,
      }).eq('id', id)

      if (error) { console.error('Erro ao editar sabor:', error); return }

      const idx = this.sabores.findIndex(s => s.id === id)
      if (idx !== -1) {
        const atual = this.sabores[idx]!
        this.sabores[idx] = {
          id: atual.id,
          nome: dados.nome ?? atual.nome,
          preco: dados.preco ?? atual.preco,
          descricao: dados.descricao ?? atual.descricao,
        }
      }
    },

    async removerSabor(id: string) {
      const supabase = useSupabaseClient()
      await supabase.from('sabores').delete().eq('id', id)
      this.sabores = this.sabores.filter(s => s.id !== id)
    },
  },
})