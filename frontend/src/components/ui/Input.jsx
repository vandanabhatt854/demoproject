import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  return (
    <label className="block space-y-1">
      {label && <span className="text-sm text-slate-300">{label}</span>}
      <input
        ref={ref}
        className={`w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-brand-500 ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </label>
  );
});

export default Input;
