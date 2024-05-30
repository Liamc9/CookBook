import React from 'react';
import { Select } from 'antd';

export default function IngredientSearch() {
const options = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
  { value: 'tom', label: 'Tom' },
];

const filterOption = (input, option) => 
  option.label.toLowerCase().includes(input.toLowerCase());

  return (
    <Select
      showSearch
      placeholder="Ingredient"
      optionFilterProp="children"
      filterOption={filterOption}
      options={options}
    />
  );
};