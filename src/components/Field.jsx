import React from 'react';

const Field = ({ label, type, name, value, onChange, options, required, minLength, placeholderColor }) => {
  const placeholderStyle = {
    color: placeholderColor,
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600 text-xs">*</span>}
      </label>

      {type === 'select' ? (
        <select
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {(options || []).map((option, index) => (
            <option key={index} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          placeholder={label}
          style={placeholderStyle}
        />
      ) : (
        <input
          type={type}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          placeholder={label}
          style={placeholderStyle}
        />
      )}
    </div>
  );
};

export default Field;
