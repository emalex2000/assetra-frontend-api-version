type TitleCardProps = {
  organisationName?: string;
};

export default function TitleCard({ organisationName }: TitleCardProps) {
  return (
    <div>
      <h1 className="font-semibold text-[36px]">
        Welcome to{" "}
        <span className="text-blue-500">
          {organisationName || "Organisation"}
        </span>{" "}
        Dashboard
      </h1>
      <p>Manage your organisation's assets from here</p>
    </div>
  );
}