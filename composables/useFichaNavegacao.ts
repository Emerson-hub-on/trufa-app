import type { FichaTecnica } from '~/stores/trufa'

export function useFichaNavegacao() {
  const store = useTrufaStore()
  const fichaSelecionada = ref<FichaTecnica | null>(null)

  watch(
    () => store.fichasTecnicas,
    (fichas) => {
      if (!fichaSelecionada.value) return
      const atualizada = fichas.find(f => f.id === fichaSelecionada.value!.id)
      if (atualizada) fichaSelecionada.value = atualizada
    },
    { deep: true }
  )

  return { fichaSelecionada }
}