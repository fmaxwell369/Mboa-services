import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ label, error, className, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </label>
    )}
    <input
      ref={ref}
      className={cn(
        'input',
        error && 'border-danger focus:ring-danger/60',
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-danger">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;