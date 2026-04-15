import { RecentlyAssignedMember } from "@/types/members";
import RecentlyAssignedDevicesTable from "../../../../../components/dashboard/RecentlyAssignedDevicesTable";
import SideBar from "../../../../../components/dashboard/LayoutNav";

const mockMembers: RecentlyAssignedMember[] = [
  {
    id: "1",
    name: "Musa Alhaji",
    email: "Musa Alhaji@gmail.com",
    role: "Admin",
    devicesAssigned: "4 Devices",
    location: "Nigeria",
    status: "Active",
  },
  {
    id: "2",
    name: "Musa Alhaji",
    email: "Musa Alhaji@gmail.com",
    role: "Member",
    devicesAssigned: "4 Devices",
    location: "Nigeria",
    status: "Active",
  },
  {
    id: "3",
    name: "Musa Alhaji",
    email: "Musa Alhaji@gmail.com",
    role: "Admin",
    devicesAssigned: "4 Devices",
    location: "Nigeria",
    status: "Pending",
  },
  {
    id: "4",
    name: "Musa Alhaji",
    email: "Musa Alhaji@gmail.com",
    role: "Member",
    devicesAssigned: "4 Devices",
    location: "Nigeria",
    status: "Active",
  },
  {
    id: "5",
    name: "Musa Alhaji",
    email: "Musa Alhaji@gmail.com",
    role: "Admin",
    devicesAssigned: "4 Devices",
    location: "Nigeria",
    status: "Active",
  },
  {
    id: "6",
    name: "Amina Yusuf",
    email: "amina@gmail.com",
    role: "Member",
    devicesAssigned: "2 Devices",
    location: "Ghana",
    status: "Pending",
  },
];

export default function RecentlyAddedPage() {
  return (
    <>
      <SideBar>
        <RecentlyAssignedDevicesTable data={mockMembers} />
      </SideBar>
    </>
  
);
}