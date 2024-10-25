'use client';
import { submitEntryRegistrationForm } from '@/app/lib/actions';
import { useUsersStore } from '@/app/store/usersStore';
import {
  Alert,
  Autocomplete,
  Button,
  ComboboxStringData,
  Flex,
  Group,
  Text,
  TextInput,
  VisuallyHidden,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconCheck, IconFaceIdError, IconQrcode } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

export default function EntryRegistrationForm() {
  const [formState, action] = useFormState(submitEntryRegistrationForm, {
    message: '',
  });
  const { users } = useUsersStore();
  const [usersData, setUsersData] = useState<ComboboxStringData>([]);
  const [showQrReader, setShowQrReader] = useState(false);
  const [formWithQr, setFormWithQr] = useState({ message: '', visitProgrammingId: '' });

  useEffect(() => {
    const uniqueUsers = new Set();
    const usersData = users.reduce((acc, user) => {
      const userInfo = `${user.user_id} - ${user.full_name}`;
      if (!uniqueUsers.has(userInfo)) {
        acc.push(userInfo as never);
        uniqueUsers.add(userInfo);
      }
      return acc;
    }, []);
    setUsersData(usersData);
  }, [users]);

  const handleQrReader = async (result: IDetectedBarcode[]) => {
    const rawValue = result[0].rawValue;
    console.log("el raw value es", rawValue)
    try {
      const qrData = JSON.parse(rawValue);

      if (
        !qrData ||
        qrData.dpiVisitor === '' ||
        qrData.nameVisitor === '' ||
        qrData.lastnameVisitor === '' ||
        qrData.resident === '' ||
        qrData.currentDate === '' ||
        qrData.visitProgrammingId === '' ||
        qrData.visitorId === ''
      ) {
        alert('QR inválido.');
        return;
      }

      console.log('la data es', qrData);

      const response = await fetch('/api/submit-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qrData),
      });

      const responseData = (await response.json()) as { message: string; visitProgrammingId: string };

      if (response.ok) {
        if (responseData?.message === 'Entrada ingresada exitósamente.') {
          setFormWithQr(responseData);
          setShowQrReader(false);
        }
      } else {
        console.error('Error al registrar entrada:', responseData);
      }
    } catch (error) {
      console.error('Error parsing QR data or submitting form', error);
    }
  };

  return (
    <form action={action}>
      <Flex direction={'column'} gap={'md'}>
        <Button
          type='button'
          leftSection={<IconQrcode />}
          onClick={() => setShowQrReader((current) => !current)}
          disabled={
            formState.message === 'Entrada ingresada exitósamente.' ||
            formWithQr.message === 'Entrada ingresada exitósamente.'
          }>
          {showQrReader ? 'Ocultar lector' : 'Escanear QR'}
        </Button>
        {showQrReader ? <Scanner onScan={(result) => handleQrReader(result)} /> : ''}
        <TextInput label='DPI' placeholder='DPI del visitante' name='dpiVisitor' required />
        <Group>
          <TextInput label='Nombre' placeholder='Nombre del visitante' name='nameVisitor' required />
          <TextInput label='Apellidos' placeholder='Apellido del visitante' name='lastnameVisitor' required />
        </Group>
        <Autocomplete
          label='El visitante viene invitado por'
          placeholder='Selecciona un residente'
          data={usersData}
          maxDropdownHeight={200}
          name='resident'
          required
        />
        <VisuallyHidden>
          <DateTimePicker
            valueFormat='DD MMM YYYY hh:mm A'
            label='Seleccionar fecha de entrada'
            placeholder='Seleccionar fecha de entrada'
            defaultValue={new Date()}
            name='currentDate'
            required
          />
        </VisuallyHidden>
        {formState.message === 'Entrada ingresada exitósamente.' ||
        formWithQr.message === 'Entrada ingresada exitósamente.' ? (
          <Alert variant='light' color='violet' title='Éxito' icon={<IconCheck />}>
            Entrada registrada exitósamente. El ID de la salida es{' '}
            <Text fs='bold'>{formState?.visitProgrammingId || formWithQr?.visitProgrammingId}</Text>
          </Alert>
        ) : (
          ''
        )}
        {formState?.message.startsWith('Error') || formWithQr?.message.startsWith('Error') ? (
          <Alert variant='light' color='red' title='Error' icon={<IconFaceIdError />}>
            {formState.message || formWithQr.message}
          </Alert>
        ) : (
          ''
        )}
        <Button
          type='submit'
          disabled={
            formState.message === 'Entrada ingresada exitósamente.' ||
            formWithQr.message === 'Entrada ingresada exitósamente.'
          }>
          Registrar ingreso
        </Button>
      </Flex>
    </form>
  );
}
