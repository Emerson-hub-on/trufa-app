import type { FichaTecnica } from '~/stores/fichas'

export function useFichaCalculo() {
  const store = useTrufaStore()

  function custoTotal(f: FichaTecnica) {
    return f.ingredientes.reduce((acc, i) => acc + i.custo, 0)
  }

  function precoSabor(nome: string) {
    return store.sabores.find(s => s.nome === nome)?.preco ?? 0
  }

  function lucroEstimado(f: FichaTecnica) {
    const preco = precoSabor(f.nome)
    const custoUn = f.producao > 0 ? custoTotal(f) / f.producao : 0
    return preco - custoUn
  }

  function margemLucro(f: FichaTecnica) {
    const preco = precoSabor(f.nome)
    if (preco === 0) return 0
    return Math.round((lucroEstimado(f) / preco) * 100)
  }

  function percIngrediente(f: FichaTecnica, custo: number) {
    const total = custoTotal(f)
    return total > 0 ? Math.round((custo / total) * 100) : 0
  }

  return { custoTotal, precoSabor, lucroEstimado, margemLucro, percIngrediente }
}