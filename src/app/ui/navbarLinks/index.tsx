import { Box, Button, Modal, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDoorEnter, IconHome, IconPencil, IconXboxX } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EntryRegistrationForm from '../forms/EntryRegistrationForm';
import ExitRegistrationForm from '../forms/ExitRegistrationForm';

const LINKS = [
  {
    key: 1,
    href: '/dashboard',
    title: 'Dashboard',
    Icon: () => <IconHome size='1rem' stroke={1.5} />,
    type: 'LINK',
    state: 'active',
  },
  {
    key: 2,
    href: '/home/nuevo',
    title: 'Nuevo',
    Icon: () => <IconPencil size='1rem' stroke={1.5} />,
    type: 'LINK',
    state: 'disabled',
  },
  {
    key: 3,
    href: '/home/nuevo',
    title: 'Nuevo Ingreso',
    Icon: () => <IconPencil size='1rem' stroke={1.5} />,
    type: 'ACTION',
    state: 'active',
  },
  {
    key: 4,
    href: '/home/nuevo',
    title: 'Nueva salida',
    Icon: () => <IconDoorEnter size='1rem' stroke={1.5} />,
    type: 'ACTION2',
    state: 'active',
  },
];

export default function NavbarLinks() {
  const pathname = usePathname();
  const [newLinkModalOpened, { open, close }] = useDisclosure(false);
  const [newExitModalOpened, { open: openExit, close: closeExit }] = useDisclosure(false);

  return (
    <Box w={'100%'}>
      {LINKS.filter((link) => link.state === 'active').map(({ key, href, title, Icon, type }) => {
        if (type === 'ACTION') {
          return (
            <NavLink
              component='button'
              key={key}
              label={title}
              leftSection={<Icon />}
              active={pathname === href}
              onClick={open}
            />
          );
        }
        if (type === 'ACTION2') {
          return (
            <NavLink
              component='button'
              key={key}
              label={title}
              leftSection={<Icon />}
              active={pathname === href}
              onClick={openExit}
            />
          );
        }

        return (
          <NavLink
            key={key}
            component={Link}
            href={href}
            label={title}
            leftSection={<Icon />}
            active={pathname === href}
          />
        );
      })}

      <Modal
        opened={newLinkModalOpened}
        onClose={close}
        title='Registrar ingreso'
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}>
        <EntryRegistrationForm />
      </Modal>

      <Modal
        opened={newExitModalOpened}
        onClose={closeExit}
        title='Registrar salida'
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}>
        <ExitRegistrationForm />
      </Modal>
    </Box>
  );
}
