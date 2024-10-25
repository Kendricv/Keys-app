'use client';
import { submitScheduleVisitForm } from '@/app/lib/actions';
import { useSessionStore } from '@/app/store/useSessionStore';
import { Alert, Button, Flex, Group, TextInput, VisuallyHidden } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconCheck, IconFaceIdError } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import QRCode from 'qrcode';

export default function ScheduleNewVisitForm() {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [formState, action] = useFormState(submitScheduleVisitForm, {
    message: '',
  });
  const { user } = useSessionStore();

  useEffect(() => {
    if (formState?.message === 'Visita programada exitósamente.') {
      const qrData = {
        dpiVisitor: formState.dpiVisitor,
        nameVisitor: formState.nameVisitor,
        lastnameVisitor: formState.lastnameVisitor,
        resident: formState.resident,
        currentDate: formState.currentDate,
        visitProgrammingId: formState.visitProgrammingId,
        visitorId: formState.visitorId,
      };

      const qrString = JSON.stringify(qrData);

      QRCode.toDataURL(qrString, { errorCorrectionLevel: 'M' }, (err, url) => {
        if (!err) {
          setQrDataUrl(url);
        } else {
          console.error('Error al generar el código QR:', err);
        }
      });
    }
  }, [formState]);

  return (
    <form action={action}>
      <Flex direction={'column'} gap={'md'}>
        <TextInput label='DPI' placeholder='DPI del visitante' name='dpiVisitor' required />
        <Group>
          <TextInput label='Nombre' placeholder='Nombre del visitante' name='nameVisitor' required />
          <TextInput label='Apellidos' placeholder='Apellido del visitante' name='lastnameVisitor' required />
        </Group>
        <VisuallyHidden>
          <TextInput
            label='El visitante viene invitado por'
            placeholder='Selecciona un residente'
            name='resident'
            defaultValue={user?.user_id}
            required
          />
        </VisuallyHidden>
        <DateTimePicker
          valueFormat='DD MMM YYYY hh:mm A'
          label='Seleccionar fecha de la visita'
          placeholder='Seleccionar fecha de la visita'
          name='currentDate'
          required
        />
        {formState?.message === 'Visita programada exitósamente.' ? (
          <Flex direction={'column'} gap={'md'}>
            <Alert variant='light' color='violet' title='Éxito' icon={<IconCheck />}>
              Visita programada exitósamente. Comparta el siguiente QR a su invitado.
            </Alert>
            {qrDataUrl && (
              <Flex direction={'column'} gap={'md'}>
                <img src={qrDataUrl} alt='QR Code' />
              </Flex>
            )}
          </Flex>
        ) : (
          ''
        )}
        {formState?.message.startsWith('Error') ? (
          <Alert variant='light' color='red' title='Error' icon={<IconFaceIdError />}>
            {formState.message}
          </Alert>
        ) : (
          ''
        )}
        <Button type='submit' disabled={formState?.message === 'Visita programada exitósamente.'}>
          Programar visita
        </Button>
      </Flex>
    </form>
  );
}
