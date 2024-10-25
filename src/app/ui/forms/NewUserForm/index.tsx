'use client';
import { createNewUser } from '@/app/lib/actions';
import { Alert, Autocomplete, Button, Flex, Group, PasswordInput, Text, TextInput } from '@mantine/core';
import { IconAt, IconCheck, IconFaceIdError, IconIdBadge2, IconPhone } from '@tabler/icons-react';
import { useFormState, useFormStatus } from 'react-dom';

const data = ['Residente', 'Administración'];

export default function NewUserForm() {
  const { pending } = useFormStatus();
  const [formState, action] = useFormState(createNewUser, {
    message: '',
  });

  return (
    <form action={action}>
      <Flex w='400px' gap={'lg'} direction={'column'}>
        <TextInput
          label='DPI'
          placeholder='DPI del visitante'
          name='dpi'
          leftSection={<IconIdBadge2 size={16} />}
          required
        />
        <Group>
          <TextInput label='Nombre' placeholder='Nombre del visitante' name='name' required />
          <TextInput label='Apellidos' placeholder='Apellido del visitante' name='lastname' required />
        </Group>
        <TextInput
          leftSection={<IconPhone size={16} />}
          label='Número de teléfono'
          placeholder='Ingresar número telefónico'
          leftSectionPointerEvents='none'
          type='tel'
          name='tel'
          required
        />
        <TextInput
          leftSection={<IconAt size={16} />}
          label='Correo'
          placeholder='Ingresar correo'
          leftSectionPointerEvents='none'
          type='email'
          name='email'
          required
        />
        <PasswordInput label='Contraseña' placeholder='Ingresa la contraseña del usuario' name='password' required />
        <Autocomplete
          label='Rol'
          description='El rol seleccionado establece los privilegios del usuario'
          placeholder='Seleccione un rol para el usuario'
          data={data}
          maxDropdownHeight={200}
          name='rol'
          required
        />
        {formState.message === 'Usuario creado con éxito.' ? (
          <Alert variant='light' color='violet' title='Éxito' icon={<IconCheck />}>
            Usuario creado con éxito.
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
        <Button type='submit' disabled={pending || formState.message === 'Usuario creado con éxito.'}>
          Registrar
        </Button>
      </Flex>
    </form>
  );
}
