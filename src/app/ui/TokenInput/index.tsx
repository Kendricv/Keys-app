import { validateOTP } from '@/app/lib/validateOTP';
import { Alert, Flex, PinInput, Title } from '@mantine/core';
import { IconFaceIdError } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  email: string;
  username: string;
};

export default function TokenInput({ email, username }: Props) {
  const [pinInputValue, setPinInputValue] = useState('');
  const [disableActions, setDisableActions] = useState(false);
  const [twoFAError, setTwoFAError] = useState(false);
  const router = useRouter();

  const handlePinInput = async (value: string) => {
    setPinInputValue(value);
    if (value.length !== 6) return;
    const isValid = await validateOTP(email, value);
    if (isValid) {
      setTwoFAError(false);
      setDisableActions(true);
      const saveSession = await fetch(`/api/save-session?username=${username}&email=${email}`);
      if (saveSession) {
        router.push('/dashboard');
      }
    } else {
      setPinInputValue('');
      setDisableActions(false);
      setTwoFAError(true);
    }
  };

  return (
    <Flex direction={'column'} gap={'md'} align={'center'}>
      <Title order={3} ta='center'>
        Ingrese el pin generado por la app:
      </Title>
      <PinInput disabled={disableActions} length={6} type='number' value={pinInputValue} onChange={handlePinInput} />
      {twoFAError ? (
        <Alert variant='light' color='red' title='Error al verificar el 2FA' icon={<IconFaceIdError />}>
          Token inválido. Por favor, inténtelo de nuevo.
        </Alert>
      ) : (
        ''
      )}
    </Flex>
  );
}
