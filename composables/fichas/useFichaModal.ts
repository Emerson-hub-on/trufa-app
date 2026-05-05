import type { FichaTecnica } from '~/stores/trufa'

export function useFichaModal(fichaSelecionada: Ref<FichaTecnica | null>) {
  const store = useTrufaStore()

  const showModalFicha = ref(false)
  const editandoFicha = ref<FichaTecnica | null>(null)
  const formFicha = reactive({ nome: '', producao: 0 })

  function abrirModalNovaFicha() {
    editandoFicha.value = null
    Object.assign(formFicha, { nome: '', producao: 0 })
    showModalFicha.value = true
  }

  function abrirModalEditarFicha(f: FichaTecnica) {
    editandoFicha.value = f
    Object.assign(formFicha, { nome: f.nome, producao: f.producao })
    showModalFicha.value = true
  }

  async function salvarFicha() {
    if (!formFicha.nome || !formFicha.producao) return
    const supabase = useSupabaseClient() as any

    if (editandoFicha.value) {
      editandoFicha.value.nome = formFicha.nome
      editandoFicha.value.producao = formFicha.producao
      await supabase.from('fichas_tecnicas').update({
        nome: formFicha.nome,
        producao: formFicha.producao,
      }).eq('id', editandoFicha.value.id)
    } else {
      const { data: { session } } = await supabase.auth.getSession()
      await store.adicionarFicha(
        { nome: formFicha.nome, producao: formFicha.producao, ingredientes: [] },
        session?.user?.id
      )
      const nova = store.fichasTecnicas.find(f => f.nome === formFicha.nome)
      if (nova) fichaSelecionada.value = nova
    }

    showModalFicha.value = false
  }

  async function confirmarExcluir(f: FichaTecnica) {
    if (!confirm(`Excluir a ficha "${f.nome}"?`)) return
    await store.removerFicha(f.id)
    fichaSelecionada.value = null
  }

  return {
    showModalFicha,
    editandoFicha,
    formFicha,
    abrirModalNovaFicha,
    abrirModalEditarFicha,
    salvarFicha,
    confirmarExcluir,
  }
}