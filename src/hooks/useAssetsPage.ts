"use client";

import { useEffect, useMemo, useState } from "react";


import { createCategory, createDevice, fetchCategories, fetchDevices } from "@/lib/services/assets";
import { Category, CreateCategoryPayload, CreateDevicePayload, Device } from "@/types/asset";

type UseDevicesPageReturn = {
  devices: Device[];
  filteredDevices: Device[];
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  loading: boolean;
  error: string | null;
  showCategoryModal: boolean;
  setShowCategoryModal: (value: boolean) => void;
  showDeviceModal: boolean;
  setShowDeviceModal: (value: boolean) => void;
  handleCreateCategory: (payload: CreateCategoryPayload) => Promise<void>;
  handleCreateDevice: (payload: CreateDevicePayload) => Promise<void>;
  refetch: () => Promise<void>;
};

export function useDevicesPage(
  organisationId: string
): UseDevicesPageReturn {
  const [devices, setDevices] = useState<Device[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const [devicesData, categoriesData] = await Promise.all([
        fetchDevices(organisationId),
        fetchCategories(organisationId),
      ]);

      setDevices(devicesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to load devices page data:", err);
      setError("Failed to load devices and categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!organisationId) return;
    void refetch();
  }, [organisationId]);

  const filteredDevices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return devices;

    return devices.filter((device) =>
      [
        device.asset_name,
        device.asset_tag,
        device.category_name,
        device.assigned_to,
        device.status,
        device.condition,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [devices, searchQuery]);

  const handleCreateCategory = async (payload: CreateCategoryPayload) => {
    try {
      const newCategory = await createCategory(organisationId, payload);
      setCategories((prev) => [newCategory, ...prev]);
      setShowCategoryModal(false);
    } catch (err) {
      console.error("Failed to create category:", err);
      throw err;
    }
  };

  const handleCreateDevice = async (payload: CreateDevicePayload) => {
    try {
      const newDevice = await createDevice(organisationId, payload);
      setDevices((prev) => [newDevice, ...prev]);
      setShowDeviceModal(false);
    } catch (err) {
      console.error("Failed to create device:", err);
      throw err;
    }
  };

  return {
    devices,
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
    refetch,
  };
}