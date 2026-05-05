import { useRelatorioFiltros } from './useRelatorioFiltros'
import { useRelatorioFormatar } from './useRelatorioFormatar'

export function useRelatorioExportar() {
  const { formatCurrency, formatDateBR } = useRelatorioFormatar()
  const {
    filtro, vendasFiltradas, comprasFiltradas, itensRendimento,
    totalVendas, totalCompras, totalUnidades, ticketMedio, rendimento, porSabor,
    store,
  } = useRelatorioFiltros()

  async function exportarExcel(tipo: string) {
    const XLSX = await import('xlsx')
    let dados: any[] = []
    let nomePlanilha = 'Relatório'

    if (tipo === 'vendas') {
      nomePlanilha = 'Vendas'
      dados = vendasFiltradas.value.map(v => ({
        Data: formatDateBR(v.data), Produto: v.produto,
        Quantidade: v.quantidade, 'Valor Unit. (R$)': v.valorUnit,
        'Total (R$)': v.quantidade * v.valorUnit,
      }))
      dados.push({ Data: '', Produto: 'TOTAL', Quantidade: totalUnidades.value, 'Valor Unit. (R$)': 0, 'Total (R$)': totalVendas.value })
    } else if (tipo === 'compras') {
      nomePlanilha = 'Compras'
      dados = comprasFiltradas.value.map(c => ({
        Data: formatDateBR(c.data), Item: c.item,
        Quantidade: c.quantidade, 'Custo (R$)': c.custo,
      }))
      dados.push({ Data: '', Item: 'TOTAL', Quantidade: '', 'Custo (R$)': totalCompras.value })
    } else if (tipo === 'rendimento') {
      nomePlanilha = 'Rendimento'
      dados = itensRendimento.value.map(i => ({
        Tipo: i.tipo, Descrição: i.descricao,
        Data: formatDateBR(i.data),
        'Valor (R$)': i.tipo === 'Venda' ? i.valor : -i.valor,
      }))
      dados.push({ Tipo: '', Descrição: 'RESULTADO', Data: '', 'Valor (R$)': rendimento.value })
    } else if (tipo === 'sabores') {
      nomePlanilha = 'Sabores'
      dados = store.sabores.map(s => ({
        Nome: s.nome, Descrição: s.descricao, 'Preço (R$)': s.preco,
      }))
    } else if (tipo === 'fichas') {
      nomePlanilha = 'Fichas Técnicas'
      store.fichasTecnicas.forEach(f => {
        dados.push({ Ficha: f.nome, Ingrediente: '', Quantidade: '', 'Custo (R$)': '' })
        f.ingredientes.forEach(i => {
          dados.push({ Ficha: '', Ingrediente: i.nome, Quantidade: i.quantidade, 'Custo (R$)': i.custo })
        })
        dados.push({ Ficha: '', Ingrediente: 'TOTAL', Quantidade: `${f.producao} unidades`, 'Custo (R$)': f.ingredientes.reduce((a, i) => a + i.custo, 0) })
        dados.push({})
      })
    }

    const ws = XLSX.utils.json_to_sheet(dados)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, nomePlanilha)
    XLSX.writeFile(wb, `relatorio-${tipo}-${filtro.de}-${filtro.ate}.xlsx`)
  }

  async function exportarPDF(tipo: string) {
    const { default: jsPDF } = await import('jspdf' as any)
    const { default: autoTable } = await import('jspdf-autotable' as any)

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const titulos: Record<string, string> = {
      vendas: 'Relatório de Vendas', compras: 'Relatório de Compras',
      rendimento: 'Relatório de Rendimento', sabores: 'Catálogo de Sabores',
      fichas: 'Fichas Técnicas',
    }

    doc.setFillColor(251, 113, 133)
    doc.rect(0, 0, 210, 28, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(15)
    doc.setFont('helvetica', 'bold')
    doc.text(`Trufa Manager — ${titulos[tipo]}`, 14, 12)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    if (tipo !== 'fichas' && tipo !== 'sabores') {
      doc.text(`Período: ${formatDateBR(filtro.de)} até ${formatDateBR(filtro.ate)}`, 14, 21)
    }

    let startY = 35

    if (tipo === 'vendas') {
      doc.setTextColor(60, 60, 60)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(`Total: ${formatCurrency(totalVendas.value)}   Unidades: ${totalUnidades.value}   Ticket médio: ${formatCurrency(ticketMedio.value)}`, 14, startY)
      startY += 8
      autoTable(doc, {
        startY,
        head: [['Data', 'Produto', 'Qtd', 'Unit.', 'Total']],
        body: [
          ...vendasFiltradas.value.map(v => [formatDateBR(v.data), v.produto, v.quantidade, formatCurrency(v.valorUnit), formatCurrency(v.quantidade * v.valorUnit)]),
          ['', 'TOTAL', totalUnidades.value, '', formatCurrency(totalVendas.value)],
        ],
        headStyles: { fillColor: [251, 113, 133], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [255, 247, 248] },
        columnStyles: { 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
      })
    } else if (tipo === 'compras') {
      doc.setTextColor(60, 60, 60)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(`Total gasto: ${formatCurrency(totalCompras.value)}   Registros: ${comprasFiltradas.value.length}`, 14, startY)
      startY += 8
      autoTable(doc, {
        startY,
        head: [['Data', 'Item', 'Quantidade', 'Custo']],
        body: [
          ...comprasFiltradas.value.map(c => [formatDateBR(c.data), c.item, c.quantidade, formatCurrency(c.custo)]),
          ['', 'TOTAL', '', formatCurrency(totalCompras.value)],
        ],
        headStyles: { fillColor: [251, 113, 133], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [255, 247, 248] },
        columnStyles: { 3: { halign: 'right' } },
      })
    } else if (tipo === 'rendimento') {
      doc.setTextColor(60, 60, 60)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(`Vendas: ${formatCurrency(totalVendas.value)}   Compras: ${formatCurrency(totalCompras.value)}   Resultado: ${formatCurrency(rendimento.value)}`, 14, startY)
      startY += 8
      autoTable(doc, {
        startY,
        head: [['Tipo', 'Descrição', 'Data', 'Valor']],
        body: [
          ...itensRendimento.value.map(i => [i.tipo, i.descricao, formatDateBR(i.data), (i.tipo === 'Venda' ? '+' : '-') + formatCurrency(i.valor)]),
          ['', 'RESULTADO', '', formatCurrency(rendimento.value)],
        ],
        headStyles: { fillColor: [251, 113, 133], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [255, 247, 248] },
        columnStyles: { 3: { halign: 'right' } },
      })
    } else if (tipo === 'sabores') {
      autoTable(doc, {
        startY,
        head: [['Nome', 'Descrição', 'Preço']],
        body: store.sabores.map(s => [s.nome, s.descricao || '—', formatCurrency(s.preco)]),
        headStyles: { fillColor: [251, 113, 133], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [255, 247, 248] },
        columnStyles: { 2: { halign: 'right' } },
      })
    } else if (tipo === 'fichas') {
      for (const f of store.fichasTecnicas) {
        const custoTotal = f.ingredientes.reduce((a, i) => a + i.custo, 0)
        autoTable(doc, {
          startY,
          head: [[{ content: `${f.nome} — ${f.producao} un. | Custo total: ${formatCurrency(custoTotal)} | Por unidade: ${formatCurrency(custoTotal / (f.producao || 1))}`, colSpan: 3 }]],
          body: [
            ...f.ingredientes.map(i => [i.nome, i.quantidade, formatCurrency(i.custo)]),
            ['TOTAL', `${f.producao} un.`, formatCurrency(custoTotal)],
          ],
          headStyles: { fillColor: [251, 113, 133], textColor: 255, fontStyle: 'bold', fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          alternateRowStyles: { fillColor: [255, 247, 248] },
          columnStyles: { 2: { halign: 'right' } },
        })
        startY = (doc as any).lastAutoTable.finalY + 8
      }
    }

    doc.save(`relatorio-${tipo}-${filtro.de}-${filtro.ate}.pdf`)
  }

  return { exportarExcel, exportarPDF }
}