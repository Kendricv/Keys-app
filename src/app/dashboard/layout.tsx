'use client';
import { AppShell, Box, Burger, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Logo from '@/app/ui/logo/logo';
import Searcher from '@/app/ui/searcher/searcher';
import DarkModeButton from '../ui/darkModeButton';
import NavbarLinks from '../ui/navbarLinks';
import AvatarButton from '../ui/AvatarButton';
import { useLocalStorageSession } from '@/app/hooks/use-local-storage-sesion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  useLocalStorageSession();

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
            <AvatarButton />
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
