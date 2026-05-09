import type { FichaTecnica, Ingrediente } from '~/stores/fichas'

export function useIngredienteModal(fichaSelecionada: Ref<FichaTecnica | null>) {
  const showModalIngrediente = ref(false)
  const formIngrediente = reactive({ nome: '', qtd: 0, unidade: 'g', custo: 0 })

  async function adicionarIngrediente() {
    if (!formIngrediente.nome || !formIngrediente.qtd || !formIngrediente.custo) return
    if (!fichaSelecionada.value) return

    const novoIngrediente: Ingrediente = {
      nome: formIngrediente.nome,
      quantidade: `${formIngrediente.qtd}${formIngrediente.unidade}`,
      custo: formIngrediente.custo,
    }

    const supabase = useSupabaseClient() as any
    const { error } = await supabase.from('ingredientes').insert({
      ficha_id: fichaSelecionada.value.id,
      nome: novoIngrediente.nome,
      quantidade: novoIngrediente.quantidade,
      custo: novoIngrediente.custo,
    })

    if (!error) {
      fichaSelecionada.value.ingredientes.push(novoIngrediente)
      Object.assign(formIngrediente, { nome: '', qtd: 0, unidade: 'g', custo: 0 })
      showModalIngrediente.value = false
    }
  }

  async function removerIngrediente(idx: number) {
    if (!fichaSelecionada.value) return
    const ing = fichaSelecionada.value.ingredientes[idx]
    if (!ing || !confirm(`Remover "${ing.nome}"?`)) return

    const supabase = useSupabaseClient() as any
    const { data } = await supabase
      .from('ingredientes')
      .select('id')
      .eq('ficha_id', fichaSelecionada.value.id)
      .eq('nome', ing.nome)
      .eq('quantidade', ing.quantidade)
      .limit(1)
      .single()

    if (data?.id) {
      await supabase.from('ingredientes').delete().eq('id', data.id)
    }

    fichaSelecionada.value.ingredientes.splice(idx, 1)
  }

  return {
    showModalIngrediente,
    formIngrediente,
    adicionarIngrediente,
    removerIngrediente,
  }
}