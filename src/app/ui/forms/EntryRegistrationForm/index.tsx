'use client';
import { submitEntryRegistrationForm } from '@/app/lib/actions';
import { Autocomplete, Button, Flex, Group, Text, TextInput } from '@mantine/core';
import { useFormState } from 'react-dom';

const data = ['1 - María Gómez', '2 - Rafa Vidal', '3 - Carlos Padilla'];

export default function EntryRegistrationForm() {
  const [formState, action] = useFormState(submitEntryRegistrationForm, {
    message: '',
  });

  return (
    <form action={action}>
      <Flex direction={'column'} gap={'md'}>
        <TextInput label='DPI' placeholder='DPI del visitante' name='dpiVisitor' required />
        <Group>
          <TextInput label='Nombre' placeholder='Nombre del visitante' name='nameVisitor' required />
          <TextInput label='Apellidos' placeholder='Apellido del visitante' name='lastnameVisitor' required />
        </Group>
        <Autocomplete
          label='El visitante viene invitado por'
          placeholder='Selecciona un residente'
          data={data}
          maxDropdownHeight={200}
          name='resident'
          required
        />
        <Text className='font-bold'>{formState.message}</Text>
        <Button type='submit'>Registrar ingreso</Button>
      </Flex>
    </form>
  );
}
