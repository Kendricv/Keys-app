'use client';
import { deleteUser } from '@/app/lib/actions';
import { UserType } from '@/app/lib/userType';
import { Alert, Button, Flex, TextInput, VisuallyHidden } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

type Props = {
  user: UserType | undefined;
};

export default function DeleteUserForm({ user }: Props) {
  const { pending } = useFormStatus();
  const [formState, action] = useFormState(deleteUser, {
    message: '',
  });

  useEffect(() => {
    if (formState?.message === 'Usuario eliminado.') {
      location.reload();
    }
  }, [formState, formState.message]);

  return (
    <form action={action}>
      <Flex w='400px' gap={'lg'} direction={'column'}>
        <VisuallyHidden>
          <TextInput
            label='Correo'
            placeholder='Ingresar correo'
            leftSectionPointerEvents='none'
            name='email'
            defaultValue={user?.email}
            required
            readOnly
          />
        </VisuallyHidden>
        <span>{formState?.message}</span>
        <Alert variant='light' color='red' title='Advertencia' icon={<IconAlertCircle />}>
          ¿Está seguro de eliminar a este usuario?
        </Alert>
        {formState?.message?.startsWith('Error') ? (
          <Alert variant='light' color='red' title='Error' icon={<IconAlertCircle />}>
            {formState.message}
          </Alert>
        ) : (
          ''
        )}
        <Button type='submit' disabled={pending}>
          Sí, eliminar usuario
        </Button>
      </Flex>
    </form>
  );
}
