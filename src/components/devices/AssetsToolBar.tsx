type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenCategoryModal: () => void;
  onOpenDeviceModal: () => void;
};

export default function DevicesToolbar({
  searchQuery,
  onSearchChange,
  onOpenCategoryModal,
  onOpenDeviceModal,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
        <p className="text-sm text-gray-500">
          Manage organisation devices and categories.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search devices..."
          className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-gray-500 md:w-72"
        />

        <button
          onClick={onOpenCategoryModal}
          className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700"
        >
          Add Category
        </button>

        <button
          onClick={onOpenDeviceModal}
          className="rounded-xl bg-gray-900 px-4 py-2 font-medium text-white"
        >
          Add Device
        </button>
      </div>
    </div>
  );
}