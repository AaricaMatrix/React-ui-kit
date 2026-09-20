import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label text */
  label?: string;
  /** Helper text shown below the input when there's no error */
  helperText?: string;
  /** Error message; when present the input is marked invalid */
  error?: string;
}

/**
 * A labeled text input with helper/error text. Associates the label,
 * helper text, and error message via aria attributes automatically.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, helperText, error, id, className, required, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-slate-300">
            {label}
            {required && <span className="ml-0.5 text-danger-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={clsx(
            'rounded-md border px-3 py-2 text-sm shadow-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            'dark:bg-slate-900 dark:text-slate-100 dark:ring-offset-slate-900',
            hasError
              ? 'border-danger-500 focus:ring-danger-500'
              : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500 dark:border-slate-600 dark:focus:border-brand-400',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500',
            className,
          )}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          {...rest}
        />
        {hasError ? (
          <p id={errorId} role="alert" className="text-xs text-danger-500">
            {error}
          </p>
        ) : (
          helperText && (
            <p id={helperId} className="text-xs text-gray-500 dark:text-slate-400">
              {helperText}
            </p>
          )
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
