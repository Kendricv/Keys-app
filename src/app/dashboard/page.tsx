import { Group } from '@mantine/core';
import { getUsers } from '../lib/actions';

export default async function DashboardPage() {
  await getUsers();
  // const us = await fetchLatestInvoices();

  return (
    <Group>
      
    </Group>
  );
}
