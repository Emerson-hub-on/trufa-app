import { reactive, ref } from 'vue'

export function useComprasForm() {
  const compra = useComprasStore()

  const showModal = ref(false)
  const form = reactive({ data: '', item: '', quantidade: '', custo: 0 })

  function salvar() {
    if (!form.data || !form.item || !form.quantidade || !form.custo) return
    compra.adicionarCompra({ ...form })
    Object.assign(form, { data: '', item: '', quantidade: '', custo: 0 })
    showModal.value = false
  }

  return { showModal, form, salvar }
}