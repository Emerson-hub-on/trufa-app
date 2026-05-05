import { useTrufaStore } from '~/stores/trufa'

export function useRelatorioFiltros() {
  const store = useTrufaStore()
  const hoje = new Date()
  const fmt = (d: Date): string => d.toISOString().split('T')[0] ?? ''

  const tipoRelatorio = ref('vendas')

  const filtro = reactive<{ de: string; ate: string; sabor: string }>({
    de: fmt(new Date(hoje.getFullYear(), hoje.getMonth(), 1)),
    ate: fmt(hoje),
    sabor: '',
  })

  const periodoAtivo = ref('Este mês')

  const periodos = [
    { label: 'Hoje', de: () => fmt(hoje), ate: () => fmt(hoje) },
    {
      label: 'Esta semana',
      de: () => { const d = new Date(hoje); d.setDate(hoje.getDate() - hoje.getDay()); return fmt(d) },
      ate: () => fmt(hoje),
    },
    {
      label: 'Este mês',
      de: () => fmt(new Date(hoje.getFullYear(), hoje.getMonth(), 1)),
      ate: () => fmt(hoje),
    },
    {
      label: 'Mês anterior',
      de: () => fmt(new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)),
      ate: () => fmt(new Date(hoje.getFullYear(), hoje.getMonth(), 0)),
    },
    { label: 'Tudo', de: () => '2000-01-01', ate: () => fmt(hoje) },
  ]

  function aplicarPeriodo(p: typeof periodos[0]) {
    filtro.de = p.de()
    filtro.ate = p.ate()
    periodoAtivo.value = p.label
  }

  const vendasFiltradas = computed(() =>
    store.vendas.filter(v => {
      const dentroData = v.data >= filtro.de && v.data <= filtro.ate
      const dentroSabor = !filtro.sabor || v.produto === filtro.sabor
      return dentroData && dentroSabor
    })
  )

  const comprasFiltradas = computed(() =>
    store.compras.filter(c => c.data >= filtro.de && c.data <= filtro.ate)
  )

  const itensRendimento = computed(() => [
    ...vendasFiltradas.value.map(v => ({
      tipo: 'Venda',
      descricao: `${v.produto} (${v.quantidade}x)`,
      data: v.data,
      valor: v.quantidade * v.valorUnit,
    })),
    ...comprasFiltradas.value.map(c => ({
      tipo: 'Compra',
      descricao: c.item,
      data: c.data,
      valor: c.custo,
    })),
  ].sort((a, b) => a.data.localeCompare(b.data)))

  const totalVendas = computed(() =>
    vendasFiltradas.value.reduce((acc, v) => acc + v.quantidade * v.valorUnit, 0)
  )
  const totalCompras = computed(() =>
    comprasFiltradas.value.reduce((acc, c) => acc + c.custo, 0)
  )
  const totalUnidades = computed(() =>
    vendasFiltradas.value.reduce((acc, v) => acc + v.quantidade, 0)
  )
  const ticketMedio = computed(() =>
    vendasFiltradas.value.length > 0 ? totalVendas.value / vendasFiltradas.value.length : 0
  )
  const rendimento = computed(() => totalVendas.value - totalCompras.value)

  const porSabor = computed(() => {
    const map: Record<string, { total: number; unidades: number }> = {}
    vendasFiltradas.value.forEach(v => {
      if (!map[v.produto]) map[v.produto] = { total: 0, unidades: 0 }
      map[v.produto]!.total += v.quantidade * v.valorUnit
      map[v.produto]!.unidades += v.quantidade
    })
    const total = totalVendas.value || 1
    return Object.entries(map)
      .map(([nome, d]) => ({ nome, ...d, percentual: (d.total / total) * 100 }))
      .sort((a, b) => b.total - a.total)
  })

  return {
    store, tipoRelatorio, filtro, periodoAtivo, periodos, aplicarPeriodo,
    vendasFiltradas, comprasFiltradas, itensRendimento,
    totalVendas, totalCompras, totalUnidades, ticketMedio, rendimento, porSabor,
  }
}