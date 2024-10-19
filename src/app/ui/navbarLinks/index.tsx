import { Box, Button, Modal, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHome, IconPencil, IconXboxX } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EntryRegistrationForm from '../forms/EntryRegistrationForm';

const LINKS = [
  {
    key: 1,
    href: '/home',
    title: 'Home',
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
    title: 'Nuevo',
    Icon: () => <IconPencil size='1rem' stroke={1.5} />,
    type: 'ACTION',
    state: 'active',
  },
];

export default function NavbarLinks() {
  const pathname = usePathname();
  const [newLinkModalOpened, { open, close }] = useDisclosure(false);

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
    </Box>
  );
}
