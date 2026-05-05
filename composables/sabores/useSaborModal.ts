import type { Sabor } from '~/stores/trufa'

export function useSaborModal() {
  const store = useTrufaStore()

  const showModal = ref(false)
  const editando = ref<Sabor | null>(null)
  const form = reactive({ nome: '', preco: 0, descricao: '' })

  function abrirModalNovo() {
    editando.value = null
    Object.assign(form, { nome: '', preco: 0, descricao: '' })
    showModal.value = true
  }

  function abrirModalEditar(sabor: Sabor) {
    editando.value = sabor
    Object.assign(form, { nome: sabor.nome, preco: sabor.preco, descricao: sabor.descricao })
    showModal.value = true
  }

  async function salvar() {
    if (!form.nome || !form.preco) return

    if (editando.value) {
      await store.editarSabor(editando.value.id, { ...form })
    } else {
      await store.adicionarSabor({ ...form })
    }

    showModal.value = false
  }

  async function excluir() {
    if (!editando.value) return
    if (!confirm(`Excluir "${editando.value.nome}"? As vendas existentes não serão apagadas.`)) return
    await store.removerSabor(editando.value.id)
    showModal.value = false
  }

  return { showModal, editando, form, abrirModalNovo, abrirModalEditar, salvar, excluir }
}