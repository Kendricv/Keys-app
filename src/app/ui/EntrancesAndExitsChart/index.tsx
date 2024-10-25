import { getEntrancesAndExits } from '@/app/lib/actions';
import Chart from './Chart';
import { Flex, Title } from '@mantine/core';

export default async function EntrancesAndExitsChart() {
  const data = await getEntrancesAndExits();

  return (
    <Flex direction={"column"} gap={"md"} w={"100%"}>
      <Title order={2}>Últimos ingresos/salidas</Title>
      <Chart data={data} />
    </Flex>
  );
}
