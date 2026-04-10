type DamagedDeviceData = {
  month: string;
  value: number;
  color?: "blue" | "black";
};

type DevicesDamagedCardProps = {
  title?: string;
  data: DamagedDeviceData[];
  highlightedIndex?: number;
  maxValue?: number;
};

export default function DevicesDamagedCard({
  title = "Devices Damaged",
  data,
  highlightedIndex = 5,
  maxValue = 25,
}: DevicesDamagedCardProps) {
  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-gray-800">{title}</h2>
      </div>

      <div className="flex gap-3">
        {/* Y axis labels */}
        <div className="flex h-45 flex-col justify-between pt-1 pb-5">
          {[25, 20, 15, 10, 5, 0].map((label) => (
            <span key={label} className="text-[10px] text-gray-400 leading-none">
              {label}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="relative flex-1">
          {/* Tooltip */}
          {data[highlightedIndex] && (
            <div
              className="absolute right-4 top-2 z-20 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-medium text-white shadow-sm"
            >
              {data[highlightedIndex].value} devices
            </div>
          )}

          <div className="flex h-[180px] items-end justify-between gap-4 border-b border-transparent">
            {data.map((item, index) => {
              const barHeight = Math.max((item.value / maxValue) * 140, item.value > 0 ? 8 : 0);

              return (
                <div
                  key={item.month}
                  className="relative flex h-full flex-1 flex-col items-center justify-end"
                >
                  {/* Vertical guide line */}
                  <div className="absolute top-0 bottom-6 w-px bg-gray-200" />

                  {/* Bar */}
                  <div
                    className={`relative z-10 w-[5px] rounded-sm ${
                      item.color === "blue" ? "bg-blue-600" : "bg-black"
                    }`}
                    style={{ height: `${barHeight}px` }}
                  />

                  {/* Month label */}
                  <span className="mt-3 text-[10px] text-gray-400">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}