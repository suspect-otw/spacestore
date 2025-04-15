'use client';

import { useState } from 'react';
import { SearchableBrandSelect } from './SearchableBrandSelect';

interface SearchableBrandSelectWrapperProps {
  defaultValue: string;
  name: string;
  emptyValue?: string;
  emptyLabel?: string;
}

export function SearchableBrandSelectWrapper({
  defaultValue,
  name,
  emptyValue = 'all',
  emptyLabel = 'All brands'
}: SearchableBrandSelectWrapperProps) {
  const [value, setValue] = useState(defaultValue);
  
  return (
    <>
      <input type="hidden" name={name} value={value} />
      <SearchableBrandSelect
        value={value}
        onValueChange={setValue}
        emptyValue={emptyValue}
        emptyLabel={emptyLabel}
      />
    </>
  );
}
