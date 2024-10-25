import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconXboxX } from '@tabler/icons-react';
import NewUserForm from '../../forms/NewUserForm';

export default function AddNewUser() {
  const [newUserModal, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open} leftSection={<IconPlus size={16} />}>
        Nuevo usuario
      </Button>
      <Modal
        opened={newUserModal}
        onClose={close}
        title='Nuevo ingreso'
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}>
        <NewUserForm />
      </Modal>
    </>
  );
}
