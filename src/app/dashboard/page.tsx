import { Flex } from '@mantine/core';
import EntrancesAndExitsChart from '@/app/ui/EntrancesAndExitsChart';
import UserTable from '@/app/ui/Tables/UserTable';
import VisitCalendar from '@/app/ui/VisitCalendar';

export default async function DashboardPage() {
  return (
    <Flex direction={"column"} gap={"md"}>
      <Flex direction={"row"} gap={"md"}>
        <EntrancesAndExitsChart />
        <VisitCalendar />
      </Flex>
      <UserTable />
    </Flex>
  );
}
