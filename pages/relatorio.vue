<template>
  <div class="flex flex-col gap-4 sm:gap-5">

    <FiltrosRelatorio
      v-model:tipoRelatorio="tipoRelatorio"
      v-model:filtro="filtro"
      :periodoAtivo="periodoAtivo"
      :periodos="periodos"
      :sabores="store.sabores"
      @aplicarPeriodo="aplicarPeriodo"
    />

    <VendasRelatorio
      v-if="tipoRelatorio === 'vendas'"
      :vendasFiltradas="vendasFiltradas"
      :totalVendas="totalVendas"
      :totalUnidades="totalUnidades"
      :ticketMedio="ticketMedio"
      :porSabor="porSabor"
      @exportarExcel="exportarExcel('vendas')"
      @exportarPDF="exportarPDF('vendas')"
    />

    <ComprasRelatorio
      v-if="tipoRelatorio === 'compras'"
      :comprasFiltradas="comprasFiltradas"
      :totalCompras="totalCompras"
      @exportarExcel="exportarExcel('compras')"
      @exportarPDF="exportarPDF('compras')"
    />

    <RendimentoRelatorio
      v-if="tipoRelatorio === 'rendimento'"
      :itensRendimento="itensRendimento"
      :totalVendas="totalVendas"
      :totalCompras="totalCompras"
      :rendimento="rendimento"
      @exportarExcel="exportarExcel('rendimento')"
      @exportarPDF="exportarPDF('rendimento')"
    />

    <SaboresRelatorio
      v-if="tipoRelatorio === 'sabores'"
      :sabores="store.sabores"
      @exportarExcel="exportarExcel('sabores')"
      @exportarPDF="exportarPDF('sabores')"
    />

    <FichasTecnicasRelatorio
      v-if="tipoRelatorio === 'fichas'"
      :fichasTecnicas="store.fichasTecnicas"
      @exportarExcel="exportarExcel('fichas')"
      @exportarPDF="exportarPDF('fichas')"
    />

  </div>
</template>

<script setup lang="ts">
import { useRelatorioExportar } from '~/composables/relatorios/useRelatorioExportar'
import { useRelatorioFiltros } from '~/composables/relatorios/useRelatorioFiltros'

definePageMeta({ layout: 'default' })

const {
  store, tipoRelatorio, filtro, periodoAtivo, periodos, aplicarPeriodo,
  vendasFiltradas, comprasFiltradas, itensRendimento,
  totalVendas, totalCompras, totalUnidades, ticketMedio, rendimento, porSabor,
} = useRelatorioFiltros()

const { exportarExcel, exportarPDF } = useRelatorioExportar()
</script>