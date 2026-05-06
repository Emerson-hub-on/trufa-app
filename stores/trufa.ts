import { defineStore } from 'pinia'
import { useVendasStore } from './vendas'
import { useComprasStore } from './compras'
import { useFichasStore } from './fichas'
import { useSaboresStore } from './sabores'

export const useTrufaStore = defineStore('trufa', {
  state: () => ({
    loading: false,
  }),

getters: {
  vendas: () => useVendasStore().vendas,
  compras: () => useComprasStore().compras,
  fichasTecnicas: () => useFichasStore().fichasTecnicas,
  sabores: () => useSaboresStore().sabores,

  totalVendas(): number {
    return useVendasStore().totalVendas
  },

  totalCompras(): number {
    return useComprasStore().totalCompras
  },

  lucro(): number {
    return this.totalVendas - this.totalCompras
  },

  custoMedio(): number {
    const fichasStore = useFichasStore()
    const totalUnidades = fichasStore.fichasTecnicas.reduce((acc, f) => acc + f.producao, 0)
    const totalCusto = fichasStore.fichasTecnicas.reduce(
      (acc, f) => acc + f.ingredientes.reduce((s, i) => s + i.custo, 0),
      0
    )
    return totalUnidades > 0 ? totalCusto / totalUnidades : 0
  },

  maisVendida(): { produto: string; vendas: number } | null {
    return useVendasStore().maisVendida
  },

  totalTrufasProduzidas(): number {
    return useFichasStore().fichasTecnicas.reduce((acc, f) => acc + f.producao, 0)
  },
},

  actions: {
    async carregarDados(userId?: string) {
      console.log('🟡 carregarDados chamado com userId:', userId)
      const supabase = useSupabaseClient() as any
      const user = useSupabaseUser()
      const id = userId || user.value?.id
      console.log('🟡 id resolvido:', id)

      this.loading = true
      if (!id) {
        console.warn('🔴 Sem id, abortando')
        this.loading = false
        return
      }

      const { data: perfil, error: perfilError } = await supabase
        .from('profiles')
        .select('role, ativo')
        .eq('id', id)
        .single()

      console.log('Perfil:', perfil, 'Erro:', perfilError)

      if (!perfil || !perfil.ativo) {
        console.warn('Bloqueado aqui! perfil:', perfil)
        this.loading = false
        return
      }

      const [{ data: vendas }, { data: compras }, { data: fichas }, { data: sabores }] =
        await Promise.all([
          supabase.from('vendas').select('*').order('created_at', { ascending: false }),
          supabase.from('compras').select('*').order('created_at', { ascending: false }),
          supabase.from('fichas_tecnicas').select('*, ingredientes(*)').order('created_at', { ascending: false }),
          supabase.from('sabores').select('*').order('created_at', { ascending: true }),
        ])

      useVendasStore().setVendas(vendas ?? [])
      useComprasStore().setCompras(compras ?? [])
      useFichasStore().setFichas(fichas ?? [])
      useSaboresStore().setSabores(sabores ?? [])

      this.loading = false
    },
  },
})