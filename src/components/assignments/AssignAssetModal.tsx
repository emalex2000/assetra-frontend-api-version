"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getData } from "country-list";
import {
  FiCheck,
  FiChevronDown,
  FiSearch,
  FiUser,
  FiBox,
  FiMapPin,
  FiCalendar,
  FiX,
} from "react-icons/fi";
import Button from "../landing_page/Button";
import type { AssignableAsset, AssignableUser } from "@/types/assignment";
import { useAssignAsset } from "@/hooks/useAssignAssets";

type AssignAssetModalProps = {
  isOpen: boolean;
  organisationId: string;
  onClose: () => void;
};

type SearchableSelectProps<T> = {
  label: string;
  placeholder: string;
  value: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelect: (item: T) => void;
  options: T[];
  loading?: boolean;
  disabled?: boolean;
  emptyText?: string;
  renderSelected: (item: T | null) => React.ReactNode;
  renderOption: (item: T) => React.ReactNode;
  getKey: (item: T) => string;
  getSearchText: (item: T) => string;
};

function SearchableSelect<T>({
  label,
  placeholder,
  value,
  searchValue,
  onSearchChange,
  onSelect,
  options,
  loading = false,
  disabled = false,
  emptyText = "No results found.",
  renderSelected,
  renderOption,
  getKey,
  getSearchText,
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) return options;

    return options.filter((item) =>
      getSearchText(item).toLowerCase().includes(search)
    );
  }, [options, searchValue, getSearchText]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value) {
      setSelectedItem(null);
      return;
    }

    const found = options.find((item) => getKey(item) === value) || null;
    setSelectedItem(found);
  }, [value, options, getKey]);

  return (
    <div ref={containerRef} className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-left text-sm text-gray-800 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-gray-50"
        >
          <div className="min-w-0 flex-1 truncate">
            {selectedItem ? (
              renderSelected(selectedItem)
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>

          <FiChevronDown
            className={`ml-3 h-4 w-4 shrink-0 text-gray-400 transition ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-3xl border border-gray-200 bg-white p-3 shadow-2xl">
            <div className="relative mb-3">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="max-h-64 overflow-y-auto pr-1">
              {loading ? (
                <div className="rounded-2xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                  Loading...
                </div>
              ) : filteredOptions.length > 0 ? (
                <div className="space-y-2">
                  {filteredOptions.map((item) => {
                    const itemKey = getKey(item);
                    const isSelected = itemKey === value;

                    return (
                      <button
                        key={itemKey}
                        type="button"
                        onClick={() => {
                          onSelect(item);
                          setSelectedItem(item);
                          setIsOpen(false);
                        }}
                        className={`flex w-full items-start justify-between rounded-2xl px-3 py-3 text-left transition ${
                          isSelected
                            ? "bg-blue-50 ring-1 ring-blue-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">{renderOption(item)}</div>

                        {isSelected && (
                          <FiCheck className="mt-1 ml-3 h-4 w-4 shrink-0 text-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                  {emptyText}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssignAssetModal({
  isOpen,
  organisationId,
  onClose,
}: AssignAssetModalProps) {
  const {
    assets,
    users,
    assetsLoading,
    usersLoading,
    submitError,
    submitting,
    loadAssets,
    loadUsers,
    submitAssignment,
  } = useAssignAsset({
    organisationId,
    enabled: isOpen,
  });

  const [assetSearch, setAssetSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [dateAssigned, setDateAssigned] = useState("");
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const countries = useMemo(() => {
    return getData()
      .map((country) => ({ code: country.code, name: country.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setSuccessMessage("");
    setAssetSearch("");
    setUserSearch("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      loadAssets(assetSearch);
    }, 300);

    return () => clearTimeout(timeout);
  }, [assetSearch, isOpen, loadAssets]);

  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      loadUsers(userSearch);
    }, 300);

    return () => clearTimeout(timeout);
  }, [userSearch, isOpen, loadUsers]);

  const selectedAsset = useMemo(
    () => assets.find((item) => item.asset_id === selectedAssetId) || null,
    [assets, selectedAssetId]
  );

  const selectedUser = useMemo(
    () => users.find((item) => item.user_id === selectedUserId) || null,
    [users, selectedUserId]
  );

  const selectedCountryName = useMemo(() => {
    return (
      countries.find((country) => country.code === locationCountry)?.name || ""
    );
  }, [countries, locationCountry]);

  function resetForm() {
    setSelectedAssetId("");
    setSelectedUserId("");
    setLocationCountry("");
    setDateAssigned("");
    setNotes("");
    setAssetSearch("");
    setUserSearch("");
    setSuccessMessage("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedAssetId || !selectedUserId || !locationCountry) return;

    try {
      await submitAssignment({
        asset: selectedAssetId,
        user: selectedUserId,
        location_country: locationCountry,
        date_assigned: dateAssigned || undefined,
        notes: notes.trim() || undefined,
      });

      setSuccessMessage("Asset assigned successfully.");
      resetForm();
      onClose();
    } catch {
      // handled in hook state
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-[32px]">
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Assign Asset</h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose the asset, the recipient, and the destination country.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 py-5 sm:px-6"
        >
          <div className="grid grid-cols-1 gap-4">
            <SearchableSelect<AssignableAsset>
              label="Asset"
              placeholder="Select an available asset"
              value={selectedAssetId}
              searchValue={assetSearch}
              onSearchChange={setAssetSearch}
              onSelect={(item) => {
                setSelectedAssetId(item.asset_id);
              }}
              options={assets}
              loading={assetsLoading}
              emptyText="No assignable assets found."
              getKey={(item) => item.asset_id}
              getSearchText={(item) =>
                `${item.asset_name} ${item.serial_number ?? ""} ${item.model ?? ""} ${item.category_name ?? ""}`
              }
              renderSelected={(item) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FiBox className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {item?.asset_name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {item?.serial_number || item?.model || "No serial"}
                    </p>
                  </div>
                </div>
              )}
              renderOption={(item) => (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FiBox className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.asset_name}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {item.serial_number || item.model || "No serial number"}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-400">
                      {item.category_name || "No category"} • {item.status}
                    </p>
                  </div>
                </div>
              )}
            />

            <SearchableSelect<AssignableUser>
              label="Assign To"
              placeholder="Select a user"
              value={selectedUserId}
              searchValue={userSearch}
              onSearchChange={setUserSearch}
              onSelect={(item) => setSelectedUserId(item.user_id)}
              options={users}
              loading={usersLoading}
              emptyText="No assignable users found."
              getKey={(item) => item.user_id}
              getSearchText={(item) =>
                `${item.email} ${item.phone_number ?? ""} ${item.role}`
              }
              renderSelected={(item) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <FiUser className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {item?.email}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {item?.role}
                    </p>
                  </div>
                </div>
              )}
              renderOption={(item) => (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <FiUser className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.email}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {item.phone_number || "No phone number"}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-400">
                      {item.role}
                    </p>
                  </div>
                </div>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Assignment Location Country
                </label>
                <div className="relative">
                  <FiMapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    value={locationCountry}
                    onChange={(e) => setLocationCountry(e.target.value)}
                    className="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  This is the country the asset is being assigned to. It will
                  update the asset&apos;s location.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Date Assigned
                </label>
                <div className="relative">
                  <FiCalendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={dateAssigned}
                    onChange={(e) => setDateAssigned(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Optional. Leave empty if you do not want to set it manually.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Optional note for this assignment"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>

          {(selectedAsset || selectedUser || locationCountry) && (
            <div className="mt-5 grid grid-cols-1 gap-3 rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Asset
                </p>
                <p className="mt-2 truncate text-sm font-medium text-gray-900">
                  {selectedAsset?.asset_name || "Not selected"}
                </p>
                <p className="mt-1 truncate text-xs text-gray-500">
                  {selectedAsset?.serial_number ||
                    selectedAsset?.model ||
                    "No asset details yet"}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Recipient
                </p>
                <p className="mt-2 truncate text-sm font-medium text-gray-900">
                  {selectedUser?.email || "Not selected"}
                </p>
                <p className="mt-1 truncate text-xs text-gray-500">
                  {selectedUser?.role || "No user details yet"}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Location
                </p>
                <p className="mt-2 truncate text-sm font-medium text-gray-900">
                  {selectedCountryName || "Not selected"}
                </p>
                <p className="mt-1 truncate text-xs text-gray-500">
                  {locationCountry || "Pick a destination country"}
                </p>
              </div>
            </div>
          )}

          {selectedAsset?.location_country && (
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Current asset location:{" "}
              <span className="font-semibold">
                {selectedAsset.location_country}
              </span>
            </div>
          )}

          {submitError && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {successMessage && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <Button
              text="Cancel"
              variant="white"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="w-full sm:w-auto"
            />

            <Button
              text={submitting ? "Assigning..." : "Assign Asset"}
              variant="blue"
              type="submit"
              className="w-full sm:w-auto"
            />
          </div>
        </form>
      </div>
    </div>
  );
}