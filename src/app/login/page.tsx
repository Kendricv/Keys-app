'use client';
import { Box, Button, Flex, Group, PasswordInput, TextInput } from '@mantine/core';
import Image from 'next/image';
import styles from './styles.module.css';
import { handleLoginAction } from '../lib/actions';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [formState, action] = useFormState(handleLoginAction, {
    message: '',
  });

  useEffect(() => {
    const userSession = localStorage.getItem('user-session') || "{}";
    const userSessionJson = JSON.parse(userSession);
    if (formState.message === 'Usuario correcto' || userSessionJson?.isLogged) {
      const userObj = {
        isLogged: true,
      };
      localStorage.setItem('user-session', JSON.stringify(userObj));
      router.push('/dashboard');
    }
  }, [formState.message, router]);

  return (
    <Group h={'100dvh'} gap={'xl'} style={{ overflow: 'hidden' }}>
      <Box visibleFrom='md'>
        <Image width={'550'} height={'1000'} alt='Imagen de login' src={'/login-image.webp'} />
      </Box>
      <Group className={styles.formContainer}>
        <form action={action}>
          <Flex w='400px' gap={'lg'} direction={'column'}>
            <TextInput label='Usuario' placeholder='Ingrese el nombre de usuario' name='username' required />
            <PasswordInput label='Contraseña' placeholder='Ingrese su contraseña' name='password' required />
            <Button type='submit'>Ingresar</Button>
            <span className='font-bold'>{formState.message}</span>
          </Flex>
        </form>
      </Group>
    </Group>
  );
}
