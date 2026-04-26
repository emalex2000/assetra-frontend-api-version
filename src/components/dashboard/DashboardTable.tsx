type AssignedDevice = {
  id: string | number;
  device: string;
  assignedTo: string;
  location: string;
  assignedBy: string;
  date: string;
  status: "Assigned" | "Returned" | "Pending";
};

type RecentlyAssignedDevicesTableProps = {
  title?: string;
  data: AssignedDevice[];
};

export default function RecentlyAssignedDevicesTable({
  title = "Recently Assigned Devices",
  data,
}: RecentlyAssignedDevicesTableProps) {
  const getStatusStyles = (status: AssignedDevice["status"]) => {
    switch (status) {
      case "Assigned":
        return "bg-gray-100 text-gray-600";
      case "Returned":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <h2 className="text-[15px] font-semibold text-gray-800 mb-4">{title}</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-[11px] font-medium text-gray-500 pb-3">
                Device
              </th>
              <th className="text-left text-[11px] font-medium text-gray-500 pb-3">
                Assigned to
              </th>
              <th className="text-left text-[11px] font-medium text-gray-500 pb-3">
                Location
              </th>
              <th className="text-left text-[11px] font-medium text-gray-500 pb-3">
                Assigned by
              </th>
              <th className="text-left text-[11px] font-medium text-gray-500 pb-3">
                Date
              </th>
              <th className="text-left text-[11px] font-medium text-gray-500 pb-3">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 last:border-b-0"
              >
                <td className="py-3 text-[12px] text-gray-600 whitespace-nowrap">
                  {item.device}
                </td>
                <td className="py-3 text-[12px] text-gray-600 whitespace-nowrap">
                  {item.assignedTo}
                </td>
                <td className="py-3 text-[12px] text-gray-600 whitespace-nowrap">
                  {item.location}
                </td>
                <td className="py-3 text-[12px] text-gray-600 whitespace-nowrap">
                  {item.assignedBy}
                </td>
                <td className="py-3 text-[12px] text-gray-600 whitespace-nowrap">
                  {item.date}
                </td>
                <td className="py-3 text-[12px] whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${getStatusStyles(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}