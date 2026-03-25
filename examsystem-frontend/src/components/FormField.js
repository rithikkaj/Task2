import React from 'react';

const FormField = ({ label, type = 'text', value, onChange, error, required, placeholder, ...rest }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field"
          {...rest}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field"
          {...rest}
        />
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default FormField;
