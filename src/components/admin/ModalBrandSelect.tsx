'use client';

import { useEffect, useState } from 'react';
import { SearchableBrandSelect } from './SearchableBrandSelect';

interface ModalBrandSelectProps {
  value: string;
  onChange: (value: string) => void;
  emptyValue?: string;
  emptyLabel?: string;
}

export function ModalBrandSelect({
  value,
  onChange,
  emptyValue = 'none',
  emptyLabel = 'None'
}: ModalBrandSelectProps) {
  // Use internal state to track the selected value
  const [selectedValue, setSelectedValue] = useState(value);
  
  // Update the internal state when the prop changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);
  
  // Handle value changes
  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };
  
  return (
    <SearchableBrandSelect
      value={selectedValue}
      onValueChange={handleValueChange}
      emptyValue={emptyValue}
      emptyLabel={emptyLabel}
      placeholder="Select a brand"
    />
  );
}
