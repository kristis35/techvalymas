// Plausible įvykių siuntimas (veikia tik jei įjungtas Plausible skriptas).
type Plausible = (event: string, opts?: { props?: Record<string, string> }) => void;

export function track(event: string, props?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const p = (window as unknown as { plausible?: Plausible }).plausible;
  p?.(event, props ? { props } : undefined);
}
