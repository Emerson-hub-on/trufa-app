import { ref, computed, onMounted } from 'vue'

export function usePeriodoFiltro<T extends { data: string }>(items: ComputedRef<T[]> | Ref<T[]>) {
  const periodoAtivo = ref('Este mês')
  const dataInicio = ref('')
  const dataFim = ref('')

  const periodos = [
    {
      label: 'Hoje',
      inicio: () => new Date().toISOString().slice(0, 10),
      fim: () => new Date().toISOString().slice(0, 10),
    },
    {
      label: 'Esta semana',
      inicio: () => {
        const d = new Date()
        d.setDate(d.getDate() - d.getDay())
        return d.toISOString().slice(0, 10)
      },
      fim: () => new Date().toISOString().slice(0, 10),
    },
    {
      label: 'Este mês',
      inicio: () => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
      },
      fim: () => new Date().toISOString().slice(0, 10),
    },
    {
      label: 'Tudo',
      inicio: () => '',
      fim: () => '',
    },
  ]

  onMounted(() => {
    const mesAtual = periodos.find(p => p.label === 'Este mês')!
    dataInicio.value = mesAtual.inicio()
    dataFim.value = mesAtual.fim()
  })

  function selecionarPeriodo(p: typeof periodos[number]) {
    periodoAtivo.value = p.label
    dataInicio.value = p.inicio()
    dataFim.value = p.fim()
  }

  const itensFiltrados = computed(() =>
    toValue(items).filter(c => {
      const apos = !dataInicio.value || c.data >= dataInicio.value
      const antes = !dataFim.value || c.data <= dataFim.value
      return apos && antes
    })
  )

  return { periodoAtivo, dataInicio, dataFim, periodos, selecionarPeriodo, itensFiltrados }
}