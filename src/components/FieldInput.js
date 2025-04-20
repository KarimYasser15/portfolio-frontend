import React from "react";

const FieldInput = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={error ? "error" : ""}
        placeholder={placeholder}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FieldInput;
