import React from 'react';

// Define props interface
interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
}

// TextInput component definition
const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder = '', type = 'text', className = '' }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border bg-gray-100 w-full text-black rounded px-6 py-4 ${className}`}
    />
  );
};

export default TextInput;
