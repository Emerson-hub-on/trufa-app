import { usePeriodoFiltro } from "../compras/usePeriodoFiltro"

export function useVendasFiltradas(saborFiltro: Ref<string | null>) {
  const store = useTrufaStore()
  const { periodoAtivo, dataInicio, dataFim, periodos, selecionarPeriodo } =
    usePeriodoFiltro(computed(() => store.vendas))

  const vendasFiltradas = computed(() =>
    store.vendas.filter(v => {
      const porSabor = !saborFiltro.value || v.produto === saborFiltro.value
      const apos = !dataInicio.value || v.data >= dataInicio.value
      const antes = !dataFim.value || v.data <= dataFim.value
      return porSabor && apos && antes
    })
  )

  const totalFiltrado = computed(() =>
    vendasFiltradas.value.reduce((acc, v) => acc + v.quantidade * v.valorUnit, 0)
  )

  const unidadesFiltradas = computed(() =>
    vendasFiltradas.value.reduce((acc, v) => acc + v.quantidade, 0)
  )

  return { periodoAtivo, dataInicio, dataFim, periodos, selecionarPeriodo, vendasFiltradas, totalFiltrado, unidadesFiltradas }
}