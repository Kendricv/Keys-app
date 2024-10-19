"use client"
import { Avatar, Menu, rem } from '@mantine/core'
import { IconLogout2 } from '@tabler/icons-react'
import { useRouter } from 'next/navigation';

export default function AvatarButton() {
  const router = useRouter();

  const handleLogOut = () => {
    localStorage.removeItem('user-session');
    router.push('/login');
  }

  return (
    <Menu>
      <Menu.Target>
        <Avatar color='violet' component='button'>AD</Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Configuración de usuario</Menu.Label>
        <Menu.Item onClick={handleLogOut} leftSection={<IconLogout2 style={{ width: rem(14), height: rem(14) }} />} color='red'>
          Cerrar sesión
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
