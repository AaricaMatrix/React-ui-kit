import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

/** A labeled checkbox with support for an error message. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={clsx(
              'h-4 w-4 rounded border-gray-300 text-brand-600',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1',
              error && 'border-danger-500',
              className,
            )}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? errorId : undefined}
            {...rest}
          />
          {label}
        </label>
        {error && (
          <p id={errorId} role="alert" className="ml-6 text-xs text-danger-500">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
