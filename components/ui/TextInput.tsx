interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Updated to HTMLTextAreaElement
  placeholder?: string;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder = '', className = '' }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`resize-none border focus:outline focus:outline-purple-500 bg-gray-50 w-full text-black rounded px-6 py-4 ${className}`}
      rows={4} // Specifies a default row count, making it visually clear it's a multiline field
    />
  );
};

export default TextInput;
