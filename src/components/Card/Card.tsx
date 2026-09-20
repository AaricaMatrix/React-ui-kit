import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  footer?: ReactNode;
  /** Removes the default padding, useful when the child content manages its own spacing */
  noPadding?: boolean;
}

/** A simple content container with an optional header and footer. */
export function Card({
  title,
  subtitle,
  footer,
  noPadding = false,
  className,
  children,
  ...rest
}: CardProps) {
  const hasHeader = Boolean(title || subtitle);

  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        'dark:border-slate-700 dark:bg-slate-900',
        className,
      )}
      {...rest}
    >
      {hasHeader && (
        <div className={clsx('border-b border-gray-100 dark:border-slate-800', !noPadding && 'px-5 py-4')}>
          {title && <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      )}
      <div className={clsx(!noPadding && 'px-5 py-4')}>{children}</div>
      {footer && (
        <div className={clsx('border-t border-gray-100 dark:border-slate-800', !noPadding && 'px-5 py-4')}>
          {footer}
        </div>
      )}
    </div>
  );
}
