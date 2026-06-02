export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <p className="rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">{message}</p>;
}
