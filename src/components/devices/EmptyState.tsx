type Props = {
  title: string;
};

export default function EmptyState({ title }: Props) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">
        Try changing your search or add a new device.
      </p>
    </div>
  );
}