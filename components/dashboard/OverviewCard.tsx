import { JSX } from "react";

type OverviewCardProps = {
  title: string;
  amount: string | number;
  description: string;
  icon?: React.ReactNode;
};

export default function OverviewCard({
  title,
  amount,
  description,
  icon,
}: OverviewCardProps): JSX.Element {
  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-medium text-gray-800">{title}</h2>
        {icon ? <div>{icon}</div> : null}
      </div>

      <p className="text-[28px] font-bold text-gray-900">{amount}</p>

      <p className="text-[13px] leading-5 text-gray-500">{description}</p>
    </div>
  );
}