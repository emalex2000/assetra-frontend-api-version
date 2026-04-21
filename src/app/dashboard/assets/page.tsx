import AssetAssignmentsTable, {
  AssetAssignmentTableItem,
} from "@/components/assignments/AssetAssignmentsTable";

const assignmentData: AssetAssignmentTableItem[] = [
  {
    id: "1",
    assetName: 'MacBook Pro 14"',
    assetType: "Laptop",
    assetId: "AST-2024-0001",
    serialNumber: "C02XQ1P2L414",
    locationId: "LOC-LAG-001",
    countryCode: "NG",
    countryName: "Nigeria",
    assignDate: "May 20, 2025",
    status: "ACTIVE",
    receiveStatus: "RECEIVED",
  },
  {
    id: "2",
    assetName: 'Dell Monitor 24"',
    assetType: "Monitor",
    assetId: "AST-2024-0002",
    serialNumber: "DEL24IPS7890",
    locationId: "LOC-NY-004",
    countryCode: "US",
    countryName: "United States",
    assignDate: "May 18, 2025",
    status: "ACTIVE",
    receiveStatus: "PENDING",
  },
  {
    id: "3",
    assetName: "iPhone 15 Pro Max",
    assetType: "Mobile Phone",
    assetId: "AST-2024-0003",
    serialNumber: "F2LX93K4Q2",
    locationId: "LOC-ABJ-002",
    countryCode: "NG",
    countryName: "Nigeria",
    assignDate: "May 15, 2025",
    status: "ACTIVE",
    receiveStatus: "RECEIVED",
  },
  {
    id: "4",
    assetName: "Sony WH-1000XM5 Wireless Headphones Long Name Test",
    assetType: "Headphones",
    assetId: "AST-2024-0005",
    serialNumber: "1000XM5BB736",
    locationId: "LOC-LDN-010",
    countryCode: "GB",
    countryName: "United Kingdom",
    assignDate: "May 21, 2025",
    status: "ACTIVE",
    receiveStatus: "PENDING",
  },
  {
    id: "5",
    assetName: "iPad Air 5th Gen",
    assetType: "Tablet",
    assetId: "AST-2024-0006",
    serialNumber: "IPAD569HL21",
    locationId: "LOC-PH-003",
    countryCode: "NG",
    countryName: "Nigeria",
    assignDate: "Apr 30, 2025",
    status: "RETURNED",
    receiveStatus: "RECEIVED",
  },
];

export default function AssignmentPage() {
  return (
    <div className="p-4 md:p-6">
      <AssetAssignmentsTable
        data={assignmentData}
        totalCount={128}
        onView={(item) => console.log("View", item)}
        onTransfer={(item) => console.log("Transfer", item)}
        onMarkReceived={(item) => console.log("Received", item)}
        onReturnAsset={(item) => console.log("Return", item)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}