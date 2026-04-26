"use client";

import { useDevicesPage } from "@/hooks/useAssetsPage";
import DevicesToolbar from "./AssetsToolBar";
import EmptyState from "./EmptyState";
import DevicesTable from "./AssetsTable";
import CategoriesPanel from "./CategoriesPanel";
import CreateCategoryModal from "./CreateCategoryModal";
import CreateDeviceModal from "./CreateAssetModal";

type Props = {
  organisationId: string;
};

export default function DevicesPageClient({ organisationId }: Props) {
  const {
    filteredDevices,
    categories,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    showCategoryModal,
    setShowCategoryModal,
    showDeviceModal,
    setShowDeviceModal,
    handleCreateCategory,
    handleCreateDevice,
  } = useDevicesPage(organisationId);

  return (
    <div className="w-full space-y-6 overflow-hidden">
      <DevicesToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCategoryModal={() => setShowCategoryModal(true)}
        onOpenDeviceModal={() => setShowDeviceModal(true)}
      />

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          {loading ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              Loading devices...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              {error}
            </div>
          ) : filteredDevices.length === 0 ? (
            <EmptyState title="No devices found" />
          ) : (
            <DevicesTable devices={filteredDevices} />
          )}
        </section>

        <aside className="min-w-0">
          <CategoriesPanel
            categories={categories}
            onAddCategory={() => setShowCategoryModal(true)}
            onDeleteCategory={() => {
              console.warn("Delete category endpoint not wired yet.");
            }}
          />
        </aside>
      </div>

      <CreateCategoryModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={handleCreateCategory}
      />

      <CreateDeviceModal
        open={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
        categories={categories}
        onSubmit={handleCreateDevice}
      />
    </div>
  );
}