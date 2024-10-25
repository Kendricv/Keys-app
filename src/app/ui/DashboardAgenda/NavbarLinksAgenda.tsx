import { Box, NavLink } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  {
    key: 1,
    href: '/agenda',
    title: 'Agenda',
    Icon: () => <IconHome size='1rem' stroke={1.5} />,
    type: 'LINK',
    state: 'active',
  },
];

export default function NavbarLinksAgenda() {
  const pathname = usePathname();

  return (
    <Box w={'100%'}>
      {LINKS.filter((link) => link.state === 'active').map(({ key, href, title, Icon, type }) => {

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
    </Box>
  );
}
