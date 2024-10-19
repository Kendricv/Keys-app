import { CloseButton, Input } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';

export default function Searcher() {
  const [searchValue, setSearchValue] = useState('Clear me');

  return (
    <Input
      w={"100%"}
      placeholder='Clearable input'
      type='search'
      value={searchValue}
      onChange={(event) => setSearchValue(event.currentTarget.value)}
      leftSection={<IconSearch size={16} />}
      rightSectionPointerEvents='all'
      rightSection={
        <CloseButton
          aria-label='Clear input'
          onClick={() => setSearchValue('')}
          style={{ display: searchValue ? undefined : 'none' }}
        />
      }
    />
  );
}
