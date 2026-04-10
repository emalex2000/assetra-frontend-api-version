"use client";

import { ReactNode, useState } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

type ActionItem = {
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
};

type QuickActionPanelProps = {
  title?: string;
  actions: ActionItem[];
  organisationId: string;
};

export default function QuickActionPanel({
  title = "Quick Action Panel",
  actions,
  organisationId,
}: QuickActionPanelProps) {
  const router = useRouter();
  const [showRegisterDeviceModal, setShowRegisterDeviceModal] =
    useState<boolean>(false);

  const handleActionClick = (action: ActionItem): void => {
    if (action.title === "Register Device") {
      setShowRegisterDeviceModal(true);
      return;
    }

    if (action.onClick) {
      action.onClick();
    }
  };

  const handleAddAsset = (): void => {
    setShowRegisterDeviceModal(false);
    router.push(`/dashboard/${organisationId}/add-asset`);
  };

  const handleUploadAsset = (): void => {
    setShowRegisterDeviceModal(false);
    router.push(`/dashboard/${organisationId}/upload-asset`);
  };

  return (
    <>
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
        <h2 className="mb-5 text-[20px] font-semibold text-gray-900">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className="
                group flex flex-col justify-between
                rounded-2xl border border-gray-200
                p-4 text-left transition-all duration-200
                hover:border-gray-300 cursor-pointer hover:shadow-sm
              "
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-[14px] w-[85px] text-gray-800">
                  {action.title}
                </span>

                {action.icon && (
                  <span className="text-gray-400">{action.icon}</span>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <span
                  className="
                    rounded-full border border-gray-200
                    p-1 text-gray-500
                    transition group-hover:bg-black group-hover:text-white
                  "
                >
                  <FiArrowRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showRegisterDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Register Device
              </h3>
              <button
                onClick={() => setShowRegisterDeviceModal(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <FiX size={18} />
              </button>
            </div>

            <p className="mb-6 text-sm text-gray-600">
              Choose how you want to register your device.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleAddAsset}
                className="rounded-2xl border border-gray-200 px-4 py-4 text-left transition hover:border-gray-300 hover:bg-gray-50"
              >
                <p className="font-semibold text-gray-900">Add Device</p>
                <p className="mt-1 text-sm text-gray-500">
                  Register a single device manually.
                </p>
              </button>

              <button
                onClick={handleUploadAsset}
                className="rounded-2xl border border-gray-200 px-4 py-4 text-left transition hover:border-gray-300 hover:bg-gray-50"
              >
                <p className="font-semibold text-gray-900">Upload Device</p>
                <p className="mt-1 text-sm text-gray-500">
                  Upload devices in bulk.
                </p>
              </button>
            </div>

            <button
              onClick={() => setShowRegisterDeviceModal(false)}
              className="mt-5 w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}