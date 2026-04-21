"use client";

import Link from "next/link";
import { FiPlusCircle, FiArrowRight } from "react-icons/fi";

export default function CreateOrganisationCard() {
  return (
    <div className="rounded-3xl w-125 border border-blue-300 bg-white p-6 shadow-sm">
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FiPlusCircle className="text-[22px]" />
          </div>

          <h2 className="text-[20px] font-semibold text-gray-900">
            Start a new organisation
          </h2>

          <p className="mt-3 text-[12px] text-gray-500">
            Set up a fresh workspace for your team, organise assets properly,
            and keep everything under one roof before humans scatter files into
            chaos again.
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/create-organisation"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Create Organisation
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}