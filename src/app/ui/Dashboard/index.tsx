'use client';
import { AppShell, Box, Burger, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Logo from '@/app/ui/logo/logo';
import Searcher from '@/app/ui/searcher/searcher';
import DarkModeButton from '@/app/ui/darkModeButton';
import NavbarLinks from '@/app/ui/navbarLinks';
import AvatarMenu from '@/app/ui/AvatarButton/AvatarMenu';
import { UserType } from '@/app/lib/userType';
import { useUsersStore } from '@/app/store/usersStore';
import { useEffect } from 'react';
import { useSessionStore } from '@/app/store/useSessionStore';

type Props = {
  session: UserType;
  children: React.ReactNode;
  users: UserType[];
};

export default function DashboardAppShell({ children, session, users }: Props) {
  const { addUser } = useUsersStore();
  const { saveUser } = useSessionStore();

  useEffect(() => {
    users.forEach(user => addUser(user));
    saveUser(session);
  }, [users, addUser]);

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding='md'>
      <AppShell.Header>
        <Flex align={'center'} justify={'space-between'} px={'md'} py={'sm'}>
          <Flex align={'center'} gap={'md'}>
            <Burger size='sm' onClick={toggleDesktop} visibleFrom='sm' />
            <Burger size='sm' onClick={toggleMobile} hiddenFrom='sm' />
            <Box visibleFrom='sm'>
              <Logo />
            </Box>
          </Flex>
          {/* <Flex visibleFrom='sm' align={'center'} gap={'md'}>
            <Searcher />
          </Flex> */}
          <Flex align={'center'} gap={'md'}>
            <DarkModeButton />
            <AvatarMenu />
          </Flex>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p='md'>
        <Flex direction={'column'} gap={'xl'}>
          <Box hiddenFrom='sm'>
            <Logo />
          </Box>
          <Flex align={'center'} gap={'md'} w={'100%'}>
            <Box hiddenFrom='sm'>
              <Searcher />
            </Box>
            <NavbarLinks />
          </Flex>
        </Flex>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
