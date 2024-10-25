import { Box, Group, } from '@mantine/core';
import Image from 'next/image';
import styles from './styles.module.css';
import LoginForm from '@/app/ui/forms/LoginForm';
import { getSession } from '@/app/lib/loginActions';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getSession();

  if (session.isLoggedIn) {
    redirect('/dashboard');
  }

  return (
    <Group h={'100dvh'} gap={'xl'} style={{ overflow: 'auto' }}>
      <Box visibleFrom='md' style={{ width: "550px" }}>
        <Image style={{ position: "fixed", top: 0, left: 0 }} width={'550'} height={'1000'} alt='Imagen de login' src={'/login-image.webp'} />
        {/* <Image width={'750'} height={'1000'} alt='Imagen de login' src={'/background.jpeg'} /> */}
      </Box>
      <Group className={styles.formContainer}>
        <LoginForm />
      </Group>
    </Group>
  );
}
