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
    <div className="space-y-6">
      <DevicesToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCategoryModal={() => setShowCategoryModal(true)}
        onOpenDeviceModal={() => setShowDeviceModal(true)}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <div>
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
        </div>

        <CategoriesPanel
          categories={categories}
          onAddCategory={() => setShowCategoryModal(true)} onDeleteCategory={function (categoryId: string): Promise<void> | void {
            throw new Error("Function not implemented.");
          } }        />
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