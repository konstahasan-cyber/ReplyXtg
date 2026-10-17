import { forwardRef, useId } from "react";

const control =
  "block w-full border-0 border-b bg-transparent px-0 py-3 text-[1.02rem] text-charcoal placeholder:text-muted/80 transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none";

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, FieldProps>(function TextField(
  { label, error, hint, optional, className = "", id, ...props },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  const describedBy = [hint && `${fid}-hint`, error && `${fid}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={fid} className="flex items-baseline justify-between text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-stone">
        <span>{label}</span>
        {optional && <span className="font-medium normal-case tracking-normal text-stone">Optional</span>}
      </label>
      <input
        ref={ref}
        id={fid}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${control} ${error ? "border-red-700" : "border-forest/30 focus:border-forest"} focus:shadow-[0_1px_0_0_var(--color-forest)]`}
        {...props}
      />
      {hint && !error && (
        <p id={`${fid}-hint`} className="mt-2 text-sm text-stone">
          {hint}
        </p>
      )}
      <FieldError id={`${fid}-err`} message={error} />
    </div>
  );
});

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  { label: string; error?: string; hint?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea({ label, error, hint, className = "", id, ...props }, ref) {
  const auto = useId();
  const fid = id ?? auto;
  const describedBy = [hint && `${fid}-hint`, error && `${fid}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={fid} className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-stone">
        {label}
      </label>
      <textarea
        ref={ref}
        id={fid}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${control} resize-y ${error ? "border-red-700" : "border-forest/30 focus:border-forest"}`}
        {...props}
      />
      {hint && !error && (
        <p id={`${fid}-hint`} className="mt-2 text-sm text-stone">
          {hint}
        </p>
      )}
      <FieldError id={`${fid}-err`} message={error} />
    </div>
  );
});

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm font-medium text-red-800" role="alert">
      <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 4.5v4.2M8 11v.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {message}
    </p>
  );
}

export const Checkbox = forwardRef<
  HTMLInputElement,
  { label: React.ReactNode; error?: string } & React.InputHTMLAttributes<HTMLInputElement>
>(function Checkbox({ label, error, id, className = "", ...props }, ref) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={fid}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fid}-err` : undefined}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer appearance-none border border-forest/50 bg-white bg-center bg-no-repeat checked:border-forest checked:bg-forest checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2016%2016%22%3E%3Cpath%20d=%22M3.5%208.5l3%203%206-6%22%20fill=%22none%22%20stroke=%22white%22%20stroke-width=%222%22/%3E%3C/svg%3E')]"
          {...props}
        />
        <label htmlFor={fid} className="cursor-pointer text-sm leading-relaxed text-stone">
          {label}
        </label>
      </div>
      <FieldError id={`${fid}-err`} message={error} />
    </div>
  );
});

/** Visually hidden honeypot field for bots. */
export function Honeypot(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}

export function ChoiceGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  columns = 2,
}: {
  name: string;
  legend: string;
  options: readonly { value: T; label: string }[];
  value?: T;
  onChange: (v: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <fieldset>
      <legend className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-stone">{legend}</legend>
      <div className={`mt-3 grid gap-2 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {options.map((o) => (
          <label
            key={o.value}
            className="relative flex min-h-12 cursor-pointer items-center border border-line bg-white px-4 py-2.5 text-sm text-charcoal transition-colors hover:border-forest/60 has-[:checked]:border-forest has-[:checked]:bg-forest has-[:checked]:text-ivory has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
