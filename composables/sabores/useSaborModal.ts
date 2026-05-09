import type { Sabor } from '~/stores/sabores'

export function useSaborModal() {
  const sabor = useSaboresStore()

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
      await sabor.editarSabor(editando.value.id, { ...form })
    } else {
      await sabor.adicionarSabor({ ...form })
    }

    showModal.value = false
  }

  async function excluir() {
    if (!editando.value) return
    if (!confirm(`Excluir "${editando.value.nome}"? As vendas existentes não serão apagadas.`)) return
    await sabor.removerSabor(editando.value.id)
    showModal.value = false
  }

  return { showModal, editando, form, abrirModalNovo, abrirModalEditar, salvar, excluir }
}