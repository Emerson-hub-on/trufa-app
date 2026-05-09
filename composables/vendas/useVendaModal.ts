

export function useVendaModal(saborFiltro: Ref<string | null>) {
  const store = useTrufaStore()
  const vendasStore = useVendasStore()

  const showModal = ref(false)
  const form = reactive({ data: '', produto: '', quantidade: 0, valorUnit: 0 })

  function abrirModal() {
    Object.assign(form, {
      data: '',
      produto: saborFiltro.value ?? '',
      quantidade: 0,
      valorUnit: saborFiltro.value
        ? (store.sabores.find(s => s.nome === saborFiltro.value)?.preco ?? 0)
        : 0,
    })
    showModal.value = true
  }

  function preencherPreco() {
    const sabor = store.sabores.find(s => s.nome === form.produto)
    if (sabor) form.valorUnit = sabor.preco
  }

  async function salvar() {
    if (!form.data || !form.produto || !form.quantidade || !form.valorUnit) return
    await vendasStore.adicionarVenda({ ...form }) // ✅ era store.adicionarVenda
    Object.assign(form, { data: '', produto: '', quantidade: 0, valorUnit: 0 })
    showModal.value = false
  }

  return { showModal, form, abrirModal, preencherPreco, salvar }
}