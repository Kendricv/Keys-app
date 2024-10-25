import { Flex } from '@mantine/core';
import VisitCalendar from '../ui/VisitCalendar';
import ScheduleNewVisit from '../ui/ScheduleNewVisit';

export default function AgendaPage() {
  return (
    <Flex direction={'column'} gap={'md'} align={"start"}>
      <ScheduleNewVisit />
      <VisitCalendar />
    </Flex>
  );
}
