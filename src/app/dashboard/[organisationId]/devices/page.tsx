"use client";

import { useParams } from "next/navigation";
import SideBar from "../../../../components/dashboard/LayoutNav";
import DevicesPageClient from "@/components/devices/AssetsPageClient";


export default function DevicesPage() {
  const params = useParams();
  const organisationId = String(params.organisationId ?? "");

  return (
    <SideBar>
      <DevicesPageClient organisationId={organisationId} />
    </SideBar>
  );
}