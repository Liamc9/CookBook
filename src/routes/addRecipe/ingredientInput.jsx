import React, { useEffect } from 'react';
import Select from 'react-select';
import { FaTrash } from 'react-icons/fa';

// Ingredient options with default units
const ingredientOptions = [
  { value: 'Flour', label: 'Flour', unit: 'g' },
  { value: 'Sugar', label: 'Sugar', unit: 'g' },
  { value: 'Salt', label: 'Salt', unit: 'g' },
  { value: 'Butter', label: 'Butter', unit: 'g' },
  { value: 'Eggs', label: 'Eggs', unit: 'pcs' },
  { value: 'Milk', label: 'Milk', unit: 'ml' },
  { value: 'Baking Powder', label: 'Baking Powder', unit: 'g' },
  { value: 'Vanilla Extract', label: 'Vanilla Extract', unit: 'ml' },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: '0.375rem',
    borderColor: '#e5e7eb',
    boxShadow: 'none',
    height: '36px',
    minHeight: '36px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 8px',
  }),
  input: (provided) => ({
    ...provided,
    margin: '0',
    padding: '0',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#374151',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: () => ({
    display: 'none',
  }),
};

const IngredientInput = ({ ingredient, onIngredientChange, onRemove }) => {
  useEffect(() => {
    // Set default unit when ingredient changes
    const selectedOption = ingredientOptions.find(option => option.value === ingredient.name);
    if (selectedOption) {
      onIngredientChange('unit', selectedOption.unit);
    }
  }, [ingredient.name, onIngredientChange]);

  const handleIngredientChange = (selectedOption) => {
    onIngredientChange('name', selectedOption ? selectedOption.value : '');
    if (selectedOption) {
      onIngredientChange('unit', selectedOption.unit);
    }
  };

  return (
    <div className="flex items-center mb-2 p-2 border rounded-md bg-white shadow-sm">
      <Select
        value={ingredientOptions.find(option => option.value === ingredient.name)}
        onChange={handleIngredientChange}
        options={ingredientOptions}
        placeholder="Ingredient"
        styles={customStyles}
        className="flex-grow"
        isClearable
      />
      
      <input
        type="number"
        value={ingredient.amount}
        onChange={(e) => onIngredientChange('amount', e.target.value)}
        placeholder="Amount"
        className="ml-2 w-20 p-1 border rounded-md text-center"
      />
      <input
        type="text"
        value={ingredient.unit}
        readOnly
        placeholder="Unit"
        className="w-10 rounded-md text-center"
      />
      <button
        onClick={onRemove}
        className="ml-2 p-1 text-red-500 hover:text-red-600 transition"
        title="Remove"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default IngredientInput;
