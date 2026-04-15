"use client";

import { CreateCategoryPayload } from "@/types/asset";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCategoryPayload) => Promise<void>;
};

export default function CreateCategoryModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
      });
      setName("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900">Create Category</h2>

        <div className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}