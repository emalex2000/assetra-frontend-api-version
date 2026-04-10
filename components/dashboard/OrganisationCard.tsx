"use client";

import {
  FiMapPin,
  FiMonitor,
  FiUsers,
  FiMoreVertical,
  FiArrowRight,
} from "react-icons/fi";
import { JSX } from "react";
import { useRouter } from "next/navigation";

type OrganisationCardProps = {
  company_id: string;
  logo?: React.ReactNode;
  name: string;
  industry: string;
  employees: string;
  assetsCount: number;
  membersCount: number;
  location: string;
  createdAt: string;
  buttonText?: string;
};

export default function OrganisationCard({
  company_id,
  logo,
  name,
  industry,
  employees,
  assetsCount,
  membersCount,
  location,
  createdAt,
  buttonText = "Open Dashboard",
}: OrganisationCardProps): JSX.Element {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/dashboard/${company_id}`);
  };

  return (
    <div
      onClick={handleNavigate} // 👈 make whole card clickable
      className="w-full cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white text-2xl">
          {logo ? logo : "A"}
        </div>

        <button
          type="button"
          onClick={(e) => e.stopPropagation()} // 👈 prevent click bubbling
          className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100"
        >
          <FiMoreVertical size={18} />
        </button>
      </div>

      <div className="space-y-1">
        <h2 className="text-[20px] font-semibold text-gray-900">{name}</h2>
        <p className="text-sm text-gray-500">
          {industry} · {employees}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <FiMonitor className="text-blue-600" size={18} />
          <div>
            <p className="text-[15px] font-semibold text-gray-900">
              {assetsCount}
            </p>
            <p className="text-xs text-gray-500">Assets</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiUsers className="text-blue-600" size={18} />
          <div>
            <p className="text-[15px] font-semibold text-gray-900">
              {membersCount}
            </p>
            <p className="text-xs text-gray-500">Members</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-gray-700">
        <FiMapPin className="text-gray-500" size={16} />
        <span>{location}</span>
      </div>

      <p className="mt-5 text-sm text-gray-500">Created on {createdAt}</p>

      {/* Button also navigates */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // prevent double trigger
          handleNavigate();
        }}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        {buttonText}
        <FiArrowRight size={16} />
      </button>
    </div>
  );
}