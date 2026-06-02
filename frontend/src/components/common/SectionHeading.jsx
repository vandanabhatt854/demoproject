export default function SectionHeading({ title, description }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
      {description && <p className="max-w-2xl text-slate-400">{description}</p>}
    </div>
  );
}
