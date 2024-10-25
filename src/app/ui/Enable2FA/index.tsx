'use client';
import { useState } from 'react';
import QRCode from 'qrcode';
import { Alert, Button, Flex, Text } from '@mantine/core';
import { usePreventTabClose } from '@/app/hooks/use-prevent-tab-close';
import { IconInfoCircle } from '@tabler/icons-react';
import TokenInput from '../TokenInput';

type Props = {
  email: string;
  username: string;
};

export default function Enable2FA({ email, username }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [disableActions, setDisableActions] = useState(false);
  usePreventTabClose();

  const generateSecret = async () => {
    const res = await fetch(`/api/generate-2fa-secret?email=${email}`);
    const data = (await res.json()) as { uri: string };
    if (!data) return;
    const decodedUri = decodeURIComponent(data.uri);

    QRCode.toDataURL(decodedUri, { errorCorrectionLevel: 'M' }, (err: Error | null | undefined, url: string) => {
      if (!err) {
        setQrDataUrl(url);
        setDisableActions(true);
      }
    });
  };

  return (
    <Flex direction={'column'} gap={'md'}>
      <Alert variant='light' color='violet' title='Configurar 2FA' icon={<IconInfoCircle />}>
        Su cuenta no posee autentificación de doble factor. Para configurarlo, de click al siguiente botón y escanee el
        QR con una aplicación de autentificación como Google Authenticator.
      </Alert>
      <Button disabled={disableActions} onClick={generateSecret}>
        Generar QR
      </Button>
      {qrDataUrl && (
        <Flex direction={'column'} gap={'md'}>
          <Text>Escanea este código QR con tu aplicación de autenticación:</Text>
          <img src={qrDataUrl} alt='QR Code' />
        </Flex>
      )}
      <TokenInput email={email} username={username} />
    </Flex>
  );
}
