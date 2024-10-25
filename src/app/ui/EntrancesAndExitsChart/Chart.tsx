"use client";

import { AreaChart } from '@mantine/charts';

type Props = {
  data: any[]
}

export default function Chart({data}: Props) {
  console.log("la data", data)

  return (
    <AreaChart
      data={data}
      h={300}
      withLegend
      withPointLabels
      dataKey="date"
      xAxisLabel="Fecha"
      yAxisLabel="Cantidad"
      tooltipAnimationDuration={200}
      series={[
        { name: 'Ingresos', color: 'indigo.6' },
        { name: 'Salidas', color: 'red.6' },
      ]}
      curveType="linear"
    />
  )
}