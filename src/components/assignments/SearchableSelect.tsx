"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiSearch } from "react-icons/fi";

export type SearchableOption = {
  value: string;
  label: string;
  subLabel?: string;
};

type SearchableSelectProps = {
  label: string;
  placeholder: string;
  options: SearchableOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  emptyText?: string;
};

export default function SearchableSelect({
  label,
  placeholder,
  options,
  selectedValue,
  onChange,
  emptyText = "No results found",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === selectedValue);
  }, [options, selectedValue]);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return options;

    return options.filter((option) => {
      return (
        option.label.toLowerCase().includes(query) ||
        option.subLabel?.toLowerCase().includes(query)
      );
    });
  }, [options, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSelect(value: string) {
    onChange(value);
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-left text-sm text-gray-800 shadow-sm transition hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <div className="min-w-0">
            {selectedOption ? (
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">
                  {selectedOption.label}
                </p>
                {selectedOption.subLabel ? (
                  <p className="truncate text-xs text-gray-500">
                    {selectedOption.subLabel}
                  </p>
                ) : null}
              </div>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>

          <FiChevronDown
            className={`h-4 w-4 shrink-0 text-gray-400 transition ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="border-b border-gray-100 p-3">
              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white"
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const active = option.value === selectedValue;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50 text-gray-800"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {option.label}
                        </p>
                        {option.subLabel ? (
                          <p className="truncate text-xs text-gray-500">
                            {option.subLabel}
                          </p>
                        ) : null}
                      </div>

                      {active ? (
                        <FiCheck className="mt-0.5 h-4 w-4 shrink-0" />
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-6 text-center text-sm text-gray-500">
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