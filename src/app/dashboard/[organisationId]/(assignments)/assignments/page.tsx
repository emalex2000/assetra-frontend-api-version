"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FaPlus, FaSync } from "react-icons/fa";
import SideBar from "../../../../../../components/dashboard/LayoutNav";
import Button from "../../../../../../components/landing-page/Button";
import OverviewCard from "../../../../../../components/dashboard/OverviewCard";
import AssignAssetModal from "@/components/assignments/AssignAssetModal";
import AssignmentTable from "@/components/assignments/AssignmentTable";
import { useAssignments } from "@/hooks/useAssignments";

export default function AssignmentsPage() {
  const params = useParams();
  const organisationId = String(params.organisationId ?? "");

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const { assignments, count, loading, error } = useAssignments({
    organisationId,
    page,
    refreshKey,
  });

  const pendingReceivedCount = assignments.filter(
    (item) => item.received_status === "PENDING"
  ).length;

  const activeAssignmentsCount = assignments.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  const assignedUsersCount = new Set(assignments.map((item) => item.user_email))
    .size;

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
            amount={String(count)}
            description={"all assignments"}
          />

          <OverviewCard
            title={"Pending Received"}
            amount={String(pendingReceivedCount)}
            description={"pending confirmation"}
          />

          <OverviewCard
            title={"Active Assignments"}
            amount={String(activeAssignmentsCount)}
            description={"currently active"}
          />

          <OverviewCard
            title={"Assigned Users"}
            amount={String(assignedUsersCount)}
            description={"users on this page"}
          />
        </div>

        <AssignmentTable
          assignments={assignments}
          loading={loading}
          error={error}
          currentPage={page}
          totalCount={count}
          pageSize={10}
          onPageChange={setPage}
        />

        <AssignAssetModal
          isOpen={isAssignModalOpen}
          organisationId={organisationId}
          onClose={() => {
            setIsAssignModalOpen(false);
            setRefreshKey((prev) => prev + 1);
          }}
        />
      </div>
    </SideBar>
  );
}