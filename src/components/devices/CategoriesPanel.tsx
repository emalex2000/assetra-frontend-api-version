"use client";

import { useState } from "react";
import { FiPlus, FiTrash2, FiFolder } from "react-icons/fi";
import { Category } from "@/types/asset";

type Props = {
  categories: Category[];
  onAddCategory: () => void;
  onDeleteCategory: (categoryId: string) => Promise<void> | void;
};

export default function CategoriesPanel({
  categories,
  onAddCategory,
  onDeleteCategory,
}: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submittingDelete, setSubmittingDelete] = useState(false);

  const selectedCategory = categories.find(
    (category) => category.category_id === deletingId
  );

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    try {
      setSubmittingDelete(true);
      await onDeleteCategory(deletingId);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setSubmittingDelete(false);
    }
  };

  return (
    <>
      <div className="flex max-h-[640px] min-h-[360px] w-full flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4 sm:p-5">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Categories
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Organize your devices into groups
            </p>
          </div>

          <button
            onClick={onAddCategory}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <FiPlus size={16} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-">
          <div className="min-w-[260px] space-y-3">
            {categories.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
                  <FiFolder size={18} />
                </div>

                <p className="text-sm font-medium text-gray-700">
                  No categories yet
                </p>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Create categories to group your devices better.
                </p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.category_id}
                  className="group relative rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-gray-300 hover:bg-white"
                >
                  <div className="pr-10">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm ring-1 ring-gray-100">
                        <FiFolder size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-semibold text-gray-900 sm:text-[15px]"
                          title={category.name}
                        >
                          {category.name || "Unnamed Category"}
                        </p>

                        <p
                          className="mt-1 line-clamp-2 text-xs text-gray-500 sm:text-sm"
                          title={category.description || "No description"}
                        >
                          {category.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setDeletingId(category.category_id)}
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent bg-white text-gray-400 shadow-sm ring-1 ring-gray-100 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${category.name}`}
                    title="Delete category"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete category?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800">
                {selectedCategory?.name || "this category"}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                disabled={submittingDelete}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={submittingDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}