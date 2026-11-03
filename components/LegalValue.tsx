/** Shows a legal datum, or a visible "pending" marker when it has not been provided yet. */
export function LegalValue({ value, label }: { value: string; label: string }) {
  if (value) return <>{value}</>;
  return <mark className="legal-pending">[{label}: pendiente]</mark>;
}
