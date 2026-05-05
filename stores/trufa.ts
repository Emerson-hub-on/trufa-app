import { defineStore } from 'pinia'

export interface Venda {
  id: string
  data: string
  produto: string
  quantidade: number
  valorUnit: number
}

export interface Compra {
  id: string
  data: string
  item: string
  quantidade: string
  custo: number
}

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

export interface Sabor {
  id: string
  nome: string
  preco: number
  descricao: string
}

export const useTrufaStore = defineStore('trufa', {
  state: () => ({
    vendas: [] as Venda[],
    compras: [] as Compra[],
    fichasTecnicas: [] as FichaTecnica[],
    sabores: [] as Sabor[],
    loading: false,
  }),

  getters: {
    totalVendas: (state) =>
      state.vendas.reduce((acc, v) => acc + v.quantidade * v.valorUnit, 0),
    totalCompras: (state) =>
      state.compras.reduce((acc, c) => acc + c.custo, 0),
    lucro: (state) => {
      const vendas = state.vendas.reduce((acc, v) => acc + v.quantidade * v.valorUnit, 0)
      const compras = state.compras.reduce((acc, c) => acc + c.custo, 0)
      return vendas - compras
    },
    totalTrufasProduzidas: (state) =>
      state.fichasTecnicas.reduce((acc, f) => acc + f.producao, 0),
    maisVendida: (state) => {
      const map: Record<string, number> = {}
      state.vendas.forEach(v => { map[v.produto] = (map[v.produto] || 0) + v.quantidade })
      const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0]
      return top ? { produto: top[0], vendas: top[1] } : null
    },
    custoMedio: (state) => {
      const totalUnidades = state.fichasTecnicas.reduce((acc, f) => acc + f.producao, 0)
      const totalCusto = state.fichasTecnicas.reduce((acc, f) => {
        return acc + f.ingredientes.reduce((s, i) => s + i.custo, 0)
      }, 0)
      return totalUnidades > 0 ? totalCusto / totalUnidades : 0
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

      const [{ data: vendas }, { data: compras }, { data: fichas }, { data: sabores }] = await Promise.all([
        supabase.from('vendas').select('*').order('created_at', { ascending: false }),
        supabase.from('compras').select('*').order('created_at', { ascending: false }),
        supabase.from('fichas_tecnicas').select('*, ingredientes(*)').order('created_at', { ascending: false }),
        supabase.from('sabores').select('*').order('created_at', { ascending: true }),
      ])
      
      

      this.vendas = (vendas ?? []).map((v: any) => ({
        id: v.id, data: v.data, produto: v.produto,
        quantidade: v.quantidade, valorUnit: v.valor_unit,
      }))

      this.compras = (compras ?? []).map((c: any) => ({
        id: c.id, data: c.data, item: c.item,
        quantidade: c.quantidade, custo: c.custo,
      }))

      this.fichasTecnicas = (fichas ?? []).map((f: any) => ({
        id: f.id, nome: f.nome, producao: f.producao,
        ingredientes: (f.ingredientes ?? []).map((i: any) => ({
          nome: i.nome, quantidade: i.quantidade, custo: i.custo,
        })),
      }))

      this.sabores = (sabores ?? []).map((s: any) => ({
        id: s.id as string,
        nome: s.nome as string,
        preco: s.preco as number,
        descricao: (s.descricao ?? '') as string,
      }))

      this.loading = false
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

    async adicionarCompra(compra: Omit<Compra, 'id'>) {
      const supabase = useSupabaseClient() as any
      const user = useSupabaseUser()
      const { data, error } = await supabase.from('compras').insert({
        user_id: user.value?.id || '54106111-67da-40ff-bfab-a213cbc8f474',
        data: compra.data, item: compra.item,
        quantidade: compra.quantidade, custo: compra.custo,
      }).select().single()
      if (!error && data) this.compras.unshift({ ...compra, id: data.id })
    },

    async removerCompra(id: string) {
      const supabase = useSupabaseClient()
      await supabase.from('compras').delete().eq('id', id)
      this.compras = this.compras.filter(c => c.id !== id)
    },

// stores/trufa.ts
async adicionarFicha(ficha: Omit<FichaTecnica, 'id'>, userId?: string) {
  const supabase = useSupabaseClient() as any
  const user = useSupabaseUser()
  const id = userId || user.value?.id

  if (!id) { console.error('Sem userId para adicionarFicha'); return }

  const { data, error } = await supabase.from('fichas_tecnicas').insert({
    user_id: id,  // ← usa o id garantido
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

    // ── Sabores ──────────────────────────────────────────────
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