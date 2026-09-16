import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
}

/** A labeled native `<select>` with a placeholder option, helper text, and error state. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, placeholder, error, helperText, id, className, required, ...rest },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="ml-0.5 text-danger-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={clsx(
            'rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            hasError
              ? 'border-danger-500 focus:ring-danger-500'
              : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
            className,
          )}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          defaultValue={rest.defaultValue ?? (placeholder ? '' : undefined)}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {hasError ? (
          <p id={errorId} role="alert" className="text-xs text-danger-500">
            {error}
          </p>
        ) : (
          helperText && (
            <p id={helperId} className="text-xs text-gray-500">
              {helperText}
            </p>
          )
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
