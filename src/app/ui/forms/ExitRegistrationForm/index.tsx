'use client';
import { submitExitRegistrationForm } from '@/app/lib/actions';
import { VisitData } from '@/app/lib/visitType';
import { Alert, Autocomplete, Button, Flex, Text } from '@mantine/core';
import { IconCheck, IconFaceIdError } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

export default function ExitRegistrationForm() {
  const [formState, action] = useFormState(submitExitRegistrationForm, {
    message: '',
  });
  const [currentVisits, setCurrentVisits] = useState<string[]>([]);

  async function fetchVisits() {
    const response = await fetch('/api/current-visits');
    const data: VisitData[] = await response.json();
    return data;
  }

  useEffect(() => {
    fetchVisits().then((data) => {
      console.log("la data de visitas es", data)
      const formattedData = data.map((visit) => `${visit.visita_programada_id} - ${visit.full_name}`);
      setCurrentVisits(formattedData);
    });
  }, []);

  return (
    <form action={action}>
      <Flex direction={'column'} gap={'md'}>
        <Autocomplete
          label='Visitas activas'
          placeholder='Seleccione la visita activa a egresar'
          data={currentVisits}
          maxDropdownHeight={200}
          name='currentVisit'
          required
        />
        {formState.message === 'Salida registrada exitósamente.' ? (
          <Alert variant='light' color='violet' title='Éxito' icon={<IconCheck />}>
            Salida registrada exitósamente.
          </Alert>
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
        <Button type='submit'>Registrar salia</Button>
      </Flex>
    </form>
  );
}
