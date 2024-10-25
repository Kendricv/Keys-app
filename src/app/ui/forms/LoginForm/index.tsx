'use client';
import { Alert, Button, Flex, PasswordInput, TextInput } from '@mantine/core';
import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/app/lib/loginActions';
import { IconAt, IconFaceIdError, IconPassword } from '@tabler/icons-react';
import Enable2FA from '../../Enable2FA';
import { useEffect, useState } from 'react';
import TokenInput from '../../TokenInput';

export default function LoginForm() {
  const [formState, action] = useFormState(login, {
    message: '',
  });
  const { pending } = useFormStatus();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isTwoFaSecretConfigured, setIsTwoFaSecretConfigured] = useState<Boolean | null>(null);
  const [invalidUser, setInvalidUser] = useState(false);

  useEffect(() => {
    const { correo, message, two_fa_secret, nombre } = formState;
    if (message.startsWith('Error')) {
      setInvalidUser(true);
      return;
    }
    setInvalidUser(false);
    if (correo) {
      setEmail(correo);
      setUsername(nombre);
    }
    if (two_fa_secret === 'No configured' || two_fa_secret === '' || two_fa_secret?.startsWith('temporal-')) {
      setIsTwoFaSecretConfigured(false);
    } else if (two_fa_secret?.length > 15) {
      setIsTwoFaSecretConfigured(true);
    }
  }, [formState, formState.correo, formState.two_fa_secret]);

  return (
    <form action={action} style={{ marginBlock: '60px' }}>
      <Flex w='400px' gap={'lg'} direction={'column'}>
        <TextInput
          label='Usuario'
          placeholder='Ingrese el nombre de usuario'
          name='username'
          leftSection={<IconAt size={16} />}
          leftSectionPointerEvents='none'
          type='email'
          required
        />
        <PasswordInput
          label='Contraseña'
          placeholder='Ingrese su contraseña'
          name='password'
          leftSection={<IconPassword size={16} />}
          leftSectionPointerEvents='none'
          required
        />
        {isTwoFaSecretConfigured === false ? <Enable2FA email={email} username={username} /> : ''}
        {isTwoFaSecretConfigured === true ? <TokenInput email={email} username={username} /> : ''}
        <Button type='submit' disabled={pending || isTwoFaSecretConfigured === false}>
          Ingresar
        </Button>
        {invalidUser ? (
          <Alert variant='light' color='red' title='Usuario inválido' icon={<IconFaceIdError />}>
            Usuario o contraseña ingresada son inválidas.
          </Alert>
        ) : (
          ''
        )}
      </Flex>
    </form>
  );
}
