'use client';
import { AppShell, Box, Burger, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Logo from '@/app/ui/logo/logo';
import Searcher from '@/app/ui/searcher/searcher';
import DarkModeButton from '@/app/ui/darkModeButton';
import AvatarMenu from '@/app/ui/AvatarButton/AvatarMenu';
import NavbarLinksAgenda from './NavbarLinksAgenda';
import { UserType } from '@/app/lib/userType';
import { useSessionStore } from '@/app/store/useSessionStore';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  session: UserType;
};

export default function AgendaDashboardAppShell({ children, session }: Props) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const { saveUser } = useSessionStore();

  useEffect(() => {
    saveUser(session);
  }, []);

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
            <NavbarLinksAgenda />
          </Flex>
        </Flex>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
