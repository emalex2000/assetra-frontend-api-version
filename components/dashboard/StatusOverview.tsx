
"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type StatusKey = string;

type ChartPoint = {
  label: string;
  [key: string]: string | number;
};

type StatusTab = {
  key: StatusKey;
  label: string;
};

type StatusOverviewCardProps = {
  title?: string;
  tabs: StatusTab[];
  data: ChartPoint[];
  defaultTab?: StatusKey;
  className?: string;
};

export default function StatusOverviewCard({
  title = "Status Overview",
  tabs,
  data,
  defaultTab,
  className = "",
}: StatusOverviewCardProps) {
  const initialTab = defaultTab || tabs[0]?.key || "";
  const [activeTab, setActiveTab] = useState<StatusKey>(initialTab);

  const activeDataKey = useMemo(() => activeTab, [activeTab]);

  return (
    <div
      className={`w-full rounded-3xl bg-white p-3 shadow-sm border border-gray-100 ${className}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="mb-6 flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-2 py-1 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="h-65 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <YAxis tickLine={false} axisLine={false} className="text-xs" />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey={activeDataKey}
              stroke="currentColor"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              className="text-black"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}