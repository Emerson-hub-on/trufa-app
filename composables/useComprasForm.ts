import { reactive, ref } from 'vue'
import { useTrufaStore } from '~/stores/trufa'

export function useComprasForm() {
  const store = useTrufaStore()
  const showModal = ref(false)
  const form = reactive({ data: '', item: '', quantidade: '', custo: 0 })

  function salvar() {
    if (!form.data || !form.item || !form.quantidade || !form.custo) return
    store.adicionarCompra({ ...form })
    Object.assign(form, { data: '', item: '', quantidade: '', custo: 0 })
    showModal.value = false
  }

  return { showModal, form, salvar }
}