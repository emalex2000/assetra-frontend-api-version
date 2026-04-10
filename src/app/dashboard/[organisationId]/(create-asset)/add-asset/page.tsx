import { FaArrowRight } from "react-icons/fa";
import Button from "../../../../../../components/landing-page/Button";
import SideBar from "../../../../../../components/dashboard/LayoutNav";

export default function CreateAsset() {
  return (
    <SideBar>
    <div className="p-4 sm:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Create Asset
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Register a new asset in your organisation
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Asset Details
          </h2>
        </div>

        <form className="space-y-6">
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Asset Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="assetName" className="text-sm font-medium text-gray-700">
                Asset Name*
              </label>
              <input
                id="assetName"
                type="text"
                placeholder="Asset name"
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Serial Number */}
            <div className="flex flex-col gap-2">
              <label htmlFor="serialNumber" className="text-sm font-medium text-gray-700">
                Serial Number*
              </label>
              <input
                id="serialNumber"
                type="text"
                placeholder="Enter device serial number"
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Model */}
            <div className="flex flex-col gap-2">
              <label htmlFor="model" className="text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                id="model"
                type="text"
                placeholder="Model"
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                id="category"
                type="text"
                placeholder="Select category"
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location*
              </label>
              <input
                id="location"
                type="text"
                placeholder="Location"
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              className="w-full sm:w-auto rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:text-red-500 hover:border-red-200"
            >
              Cancel
            </button>

            <div className="w-full sm:w-auto">
              <Button
                text={"Create asset"}
                variant={"black"}
                href={""}
                icon={FaArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto bg-blue-500"
              />
            </div>
          </div>
        </form>
      </div>
    </div>

  </SideBar>
  );
}