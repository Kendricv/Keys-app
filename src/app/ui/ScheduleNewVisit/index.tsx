'use client';
import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconXboxX } from '@tabler/icons-react';
import ScheduleNewVisitForm from '../forms/ScheduleNewVisitForm';

export default function ScheduleNewVisit() {
  const [newLinkModalOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open} leftSection={<IconPlus />}>
        Programar visita
      </Button>
      <Modal
        opened={newLinkModalOpened}
        onClose={close}
        title='Programar visita'
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}>
        <ScheduleNewVisitForm />
      </Modal>
    </>
  );
}
