import React from "react";

export default function FormField({ id, label, type = "text", value, onChange, error, hint, autoComplete }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : "false"}
      />
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && <p className="field-error show">{error}</p>}
    </div>
  );
}
