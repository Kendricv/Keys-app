'use client';
import { editUser } from '@/app/lib/actions';
import { UserType } from '@/app/lib/userType';
import { Alert, Autocomplete, Button, Flex, Group, PasswordInput, TextInput } from '@mantine/core';
import { IconAt, IconCheck, IconFaceIdError, IconIdBadge2, IconPhone } from '@tabler/icons-react';
import { useFormState, useFormStatus } from 'react-dom';

const data = ['Residente', 'Administración'];

type Props = {
  user: UserType | undefined;
}

export default function EditUserForm({ user }: Props) {
  const { pending } = useFormStatus();
  const [formState, action] = useFormState(editUser, {
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
          defaultValue={user?.user_id}
          description="Solo de lectura"
          readOnly
        />
        <Group>
          <TextInput label='Nombre' placeholder='Nombre del visitante' name='name' required defaultValue={user?.username} />
          <TextInput label='Apellidos' placeholder='Apellido del visitante' name='lastname' required defaultValue={user?.lastname} />
        </Group>
        <TextInput
          leftSection={<IconPhone size={16} />}
          label='Número de teléfono'
          placeholder='Ingresar número telefónico'
          leftSectionPointerEvents='none'
          type='tel'
          name='tel'
          defaultValue={user?.tel}
          required
        />
        <TextInput
          leftSection={<IconAt size={16} />}
          label='Correo'
          placeholder='Ingresar correo'
          leftSectionPointerEvents='none'
          type='email'
          name='email'
          defaultValue={user?.email}
          required
          description="Solo de lectura"
          readOnly
        />
        <PasswordInput label='Contraseña' placeholder='Ingresa la contraseña del usuario' name='password' />
        <Autocomplete
          label='Rol'
          description='El rol seleccionado establece los privilegios del usuario'
          placeholder='Seleccione un rol para el usuario'
          data={data}
          maxDropdownHeight={200}
          name='rol'
          defaultValue={user?.rol}
          required
        />
        {formState.message === 'Usuario editado con éxito.' ? (
          <Alert variant='light' color='violet' title='Éxito' icon={<IconCheck />}>
            Usuario editado con éxito.
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
        <Button type='submit' disabled={pending || formState.message === 'Usuario editado con éxito.'}>
          Guardar cambios
        </Button>
      </Flex>
    </form>
  );
}
