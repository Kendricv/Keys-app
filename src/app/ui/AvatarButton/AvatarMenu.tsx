'use client';
import { Avatar, Menu, rem } from '@mantine/core';
import { IconLogout2 } from '@tabler/icons-react';
import { logout } from '@/app/lib/loginActions';
import { useSessionStore } from '@/app/store/useSessionStore';

export default function AvatarMenu() {
  const { user } = useSessionStore();

  return (
    <Menu>
      <Menu.Target>
        <Avatar color='violet' component='button'>
          {user?.full_name.slice(0, 2).toUpperCase() || ''}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Configuración de usuario</Menu.Label>
        <form action={logout}>
          <Menu.Item
            type='submit'
            leftSection={<IconLogout2 style={{ width: rem(14), height: rem(14) }} />}
            color='red'>
            Cerrar sesión
          </Menu.Item>
        </form>
      </Menu.Dropdown>
    </Menu>
  );
}
