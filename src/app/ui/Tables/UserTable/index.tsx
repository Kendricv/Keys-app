'use client';

import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { ActionIcon, Box, Flex, Group, Modal, TextInput, Title } from '@mantine/core';
import { IconEdit, IconSearch, IconTrash, IconX, IconXboxX } from '@tabler/icons-react';
import AddNewUser from './AddNewUser';
import { useUsersStore } from '@/app/store/usersStore';
import { UserType } from '@/app/lib/userType';
import EditUserForm from '../../forms/EditUserForm';
import DeleteUserForm from '../../forms/DeleteUserForm';

const PAGE_SIZE = 5;

export default function UserTable() {
  const { users } = useUsersStore();
  const [records, setRecords] = useState<UserType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(users.length);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [editUserModal, { open: openEditUserModal, close: closeEditUserModal }] = useDisclosure(false);
  const [deleteUserModal, { open: openDeleteUserModal, close: closeDeleteUserModal }] = useDisclosure(false);
  const [currentUser, setCurrentUser] = useState<UserType>();

  useEffect(() => {
    setRecords(users.slice(0, PAGE_SIZE));
  }, [users]);

  useEffect(() => {
    // Filtramos
    const filteredUsers = users.filter(({ full_name }) => {
      if (debouncedQuery !== '' && !`${full_name}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase()))
        return false;

      return true;
    });

    // Aplicamos la filtración y paginación
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(filteredUsers.slice(from, to));
    setTotalPages(filteredUsers.length);
  }, [page, debouncedQuery]);

  return (
    <Flex direction={'column'} gap={'md'}>
      <Flex justify={'space-between'}>
        <Title order={2}>Usuarios activos</Title>
        <AddNewUser />
      </Flex>
      <DataTable
        height={300}
        withTableBorder
        borderRadius='sm'
        withColumnBorders
        striped
        highlightOnHover
        // provide data
        records={records}
        idAccessor='user_id'
        // define columns
        columns={[
          { accessor: 'user_id', title: 'ID' },
          {
            accessor: 'full_name',
            title: 'Nombre completo',
            filter: (
              <TextInput
                label='Nombre completo'
                placeholder='Buscar usuario...'
                leftSection={<IconSearch size={16} />}
                rightSection={
                  <ActionIcon size='sm' variant='transparent' c='dimmed' onClick={() => setQuery('')}>
                    <IconX size={14} />
                  </ActionIcon>
                }
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
              />
            ),
            filtering: query !== '',
          },
          { accessor: 'email' },
          { accessor: 'rol' },
          {
            accessor: 'actions',
            title: <Box mr={6}>Acciones</Box>,
            textAlign: 'right',
            render: (user) => (
              <Group gap={4} justify='right' wrap='nowrap'>
                <ActionIcon
                  size='sm'
                  variant='subtle'
                  color='blue'
                  onClick={() => {
                    openEditUserModal();
                    setCurrentUser(user);
                  }}>
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  size='sm'
                  variant='subtle'
                  color='red'
                  onClick={() => {
                    openDeleteUserModal();
                    setCurrentUser(user);
                  }}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ),
          },
        ]}
        totalRecords={totalPages}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => setPage(p)}
      />
      <Modal
        opened={editUserModal}
        onClose={closeEditUserModal}
        title='Editar usuario'
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}>
        <EditUserForm user={currentUser} />
      </Modal>
      <Modal
        opened={deleteUserModal}
        onClose={closeDeleteUserModal}
        title='Eliminar usuario'
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}>
        <DeleteUserForm user={currentUser} />
      </Modal>
    </Flex>
  );
}
