import { Flex, Title } from '@mantine/core';
import { IconHomeEco } from '@tabler/icons-react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href={'/dashboard'}>
      <Flex gap={'md'} justify={'center'} align={'center'} c={'violet'}>
        <IconHomeEco />
        <Title order={2} c='violet'>
          Keys App
        </Title>
      </Flex>
    </Link>
  );
}
