"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FaPlus, FaSync } from "react-icons/fa";
import SideBar from "../../../../../../components/dashboard/LayoutNav";
import Button from "../../../../../../components/landing-page/Button";
import OverviewCard from "../../../../../../components/dashboard/OverviewCard";
import AssignmentsTableSection from "@/components/assignments/AssignmentTable";
import AssignAssetModal from "@/components/assignments/AssignAssetModal";

export default function AssignmentsPage() {
  const params = useParams();
  const organisationId = String(params.organisationId ?? "");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  return (
    <SideBar>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-semibold text-gray-900">
              Asset Assignments
            </h1>
            <p className="text-sm text-gray-500">
              View and manage all asset assignments within your organisation
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              text={"Transfer Asset"}
              variant={"white"}
              href={"asset-transfer"}
              iconPosition="left"
              icon={FaSync}
              className="w-full sm:w-auto"
            />

            <Button
              text={"Assign Asset"}
              variant={"blue"}
              onClick={() => setIsAssignModalOpen(true)}
              iconPosition="left"
              icon={FaPlus}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            title={"Total Assignments"}
            amount={"128"}
            description={"all assignments"}
          />

          <OverviewCard
            title={"Pending Received"}
            amount={"10"}
            description={"all assets on pending"}
          />

          <OverviewCard
            title={"Active Assignments"}
            amount={"24"}
            description={"all assignments still active"}
          />

          <OverviewCard
            title={"Assigned Users"}
            amount={"5"}
            description={"all users assigned assets"}
          />
        </div>

        <AssignmentsTableSection />

        <AssignAssetModal
          isOpen={isAssignModalOpen}
          organisationId={organisationId}
          onClose={() => setIsAssignModalOpen(false)}
        />
      </div>
    </SideBar>
  );
}